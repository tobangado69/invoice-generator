"use client";

import { useInvoices } from "@/hooks/use-invoices";
import { useCompany } from "@/hooks/use-company";
import { InvoiceTable } from "@/components/invoice-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/indonesian-utils";
import { useMemo } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  Calculator,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  draft: "#94a3b8",
  sent: "#3b82f6",
  paid: "#22c55e",
  overdue: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
};

export default function DashboardPage() {
  const { data: invoicesData, isLoading } = useInvoices({ limit: 100 });
  const { data: companyData } = useCompany();

  const { stats, monthlyData, statusData } = useMemo(() => {
    if (!invoicesData?.success) {
      return {
        stats: {
          totalInvoices: 0,
          pendingAmount: 0,
          paidAmount: 0,
          ppnCollected: 0,
          avgInvoice: 0,
        },
        monthlyData: [],
        statusData: [],
      };
    }

    const invoices = invoicesData.data;

    const totalInvoices = invoices.length;
    const pendingAmount = invoices
      .filter((i) => i.status !== "paid")
      .reduce((sum, i) => sum + i.totalAmount, 0);
    const paidAmount = invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.totalAmount, 0);
    const ppnCollected = invoices.reduce((sum, i) => sum + i.ppnAmount, 0);
    const totalAmount = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const avgInvoice = totalInvoices > 0 ? totalAmount / totalInvoices : 0;

    const monthMap = new Map<string, { revenue: number; count: number }>();
    invoices.forEach((inv) => {
      const d = new Date(inv.issueDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const existing = monthMap.get(key) || { revenue: 0, count: 0 };
      monthMap.set(key, {
        revenue: existing.revenue + inv.totalAmount,
        count: existing.count + 1,
      });
    });

    const monthlyData = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({
        month: month.split("-")[1] + "/" + month.split("-")[0].slice(2),
        revenue: data.revenue,
        count: data.count,
      }));

    const statusCount = new Map<string, number>();
    invoices.forEach((inv) => {
      statusCount.set(inv.status, (statusCount.get(inv.status) || 0) + 1);
    });

    const statusData = Array.from(statusCount.entries()).map(
      ([status, count]) => ({
        name: STATUS_LABELS[status] || status,
        value: count,
        color: STATUS_COLORS[status] || "#94a3b8",
      })
    );

    return {
      stats: {
        totalInvoices,
        pendingAmount,
        paidAmount,
        ppnCollected,
        avgInvoice,
      },
      monthlyData,
      statusData,
    };
  }, [invoicesData]);

  const companyName =
    companyData?.success && companyData.data
      ? companyData.data.name
      : "Welcome";

  const statCards = [
    {
      title: "Total Invoices",
      value: stats.totalInvoices.toString(),
      subtitle: `${stats.totalInvoices} invoice`,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Unpaid",
      value: formatIDR(stats.pendingAmount),
      subtitle: "Awaiting payment",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Paid",
      value: formatIDR(stats.paidAmount),
      subtitle: "Total paid",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "VAT Collected",
      value: formatIDR(stats.ppnCollected),
      subtitle: "Total tax",
      icon: Calculator,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-balance">
            Welcome, {companyName}
          </h1>
          <p className="text-muted-foreground">
            Manage your invoices and business finances
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/clients">
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Clients
            </Button>
          </Link>
          <Link href="/invoices/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </Link>
        </div>
      </section>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.title}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {card.title}
                        </p>
                        <p className="text-2xl font-bold">{card.value}</p>
                        <p className="text-xs text-muted-foreground">
                          {card.subtitle}
                        </p>
                      </div>
                      <div
                        className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Monthly Revenue</CardTitle>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyData}>
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        tickFormatter={(v) =>
                          v >= 1000000
                            ? `${(v / 1000000).toFixed(0)}jt`
                            : v >= 1000
                              ? `${(v / 1000).toFixed(0)}rb`
                              : v.toString()
                        }
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          formatIDR(value),
                          "Revenue",
                        ]}
                        labelFormatter={(label) => `Month ${label}`}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    Create an invoice to see the revenue chart
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Invoice Status</CardTitle>
              </CardHeader>
              <CardContent>
                {statusData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          dataKey="value"
                          paddingAngle={3}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                      {statusData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                    No data yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/invoices/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Create New Invoice</p>
                <p className="text-sm text-muted-foreground">
                  Create a professional invoice
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 ml-auto text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/clients">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Manage Clients</p>
                <p className="text-sm text-muted-foreground">
                  Your client database
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 ml-auto text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/settings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Settings</p>
                <p className="text-sm text-muted-foreground">
                  Your account & plan
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 ml-auto text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Recent Invoices</h2>
        <InvoiceTable limit={5} />
      </section>
    </div>
  );
}
