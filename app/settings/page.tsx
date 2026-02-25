"use client";

import { useAuth } from "@/hooks/use-auth";
import { useInvoices } from "@/hooks/use-invoices";
import { useClients } from "@/hooks/use-clients";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PLANS, getPlan, type PlanId } from "@/lib/plans";
import { formatIDR } from "@/lib/indonesian-utils";
import {
  Check,
  Crown,
  FileText,
  Users,
  ArrowUpRight,
  Shield,
  CreditCard,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: invoicesData, isLoading: loadingInvoices } = useInvoices({
    limit: 100,
  });
  const { data: clientsData, isLoading: loadingClients } = useClients();

  const currentPlan = getPlan("free");

  const usage = useMemo(() => {
    const invoiceCount =
      invoicesData?.success ? invoicesData.data.length : 0;
    const clientCount =
      clientsData && "data" in clientsData && clientsData.success
        ? clientsData.data.length
        : 0;

    const invoiceLimit = currentPlan.limits.invoicesPerMonth;
    const clientLimit = currentPlan.limits.clients;

    return {
      invoiceCount,
      clientCount,
      invoiceLimit,
      clientLimit,
      invoicePercent:
        invoiceLimit === -1 ? 0 : (invoiceCount / invoiceLimit) * 100,
      clientPercent:
        clientLimit === -1 ? 0 : (clientCount / clientLimit) * 100,
    };
  }, [invoicesData, clientsData, currentPlan]);

  const plans = Object.values(PLANS);

  const isLoading = loadingInvoices || loadingClients;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account, plan, and settings
        </p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">
                {user?.name?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase() ||
                  "U"}
              </span>
            </div>
            <div>
              <CardTitle className="text-lg">
                {user?.name || "User"}
              </CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              <Crown className="w-3 h-3 mr-1" />
              {currentPlan.name} Plan
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Usage
          </CardTitle>
          <CardDescription>
            Feature usage for your current plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>Invoices this month</span>
                  </div>
                  <span className="font-medium">
                    {usage.invoiceCount} /{" "}
                    {usage.invoiceLimit === -1
                      ? "Unlimited"
                      : usage.invoiceLimit}
                  </span>
                </div>
                {usage.invoiceLimit !== -1 && (
                  <Progress
                    value={Math.min(usage.invoicePercent, 100)}
                    className="h-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Total clients</span>
                  </div>
                  <span className="font-medium">
                    {usage.clientCount} /{" "}
                    {usage.clientLimit === -1
                      ? "Unlimited"
                      : usage.clientLimit}
                  </span>
                </div>
                {usage.clientLimit !== -1 && (
                  <Progress
                    value={Math.min(usage.clientPercent, 100)}
                    className="h-2"
                  />
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Subscription Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan.id;
            return (
              <Card
                key={plan.id}
                className={
                  isCurrent ? "border-blue-500 border-2" : "border"
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    {isCurrent && (
                      <Badge className="bg-blue-600">Active</Badge>
                    )}
                    {plan.id === "pro" && !isCurrent && (
                      <Badge variant="outline">Popular</Badge>
                    )}
                  </div>
                  <div className="pt-2">
                    <span className="text-2xl font-bold">
                      {plan.price === 0 ? "Free" : formatIDR(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground text-sm">
                        /month
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-muted-foreground text-xs">
                        + {plan.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                  {!isCurrent && (
                    <Button className="w-full mt-4" variant="outline" size="sm">
                      {plan.price > currentPlan.price
                        ? "Upgrade"
                        : "Downgrade"}
                      <ArrowUpRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/profile">
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                Company Profile
                <ArrowUpRight className="w-4 h-4 ml-auto" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                View All Plans
                <ArrowUpRight className="w-4 h-4 ml-auto" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
