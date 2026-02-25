"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, ArrowRight } from "lucide-react";
import { PLANS, type PlanId } from "@/lib/plans";
import { formatIDR } from "@/lib/indonesian-utils";

export default function PricingPage() {
  const plans = Object.values(PLANS);

  const comparisonFeatures = [
    { label: "Invoices per month", key: "invoicesPerMonth" as const },
    { label: "Number of clients", key: "clients" as const },
    { label: "PDF Downloads", key: "pdfDownloads" as const },
    { label: "Custom branding", key: "customBranding" as const },
    { label: "Priority support", key: "prioritySupport" as const },
    { label: "Recurring invoices", key: "recurringInvoices" as const },
    { label: "Multi-currency", key: "multiCurrency" as const },
    { label: "Team members", key: "teamMembers" as const },
  ] as const;

  const faqs = [
    {
      q: "Are there any hidden fees?",
      a: "No. The listed price includes all mentioned features. There are no setup fees, per-invoice fees, or any other additional charges.",
    },
    {
      q: "Can I upgrade or downgrade at any time?",
      a: "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect in the next billing period.",
    },
    {
      q: "Is my data secure?",
      a: "Yes, we use end-to-end encryption and servers located in Indonesia to ensure your data security.",
    },
    {
      q: "What payment methods are available?",
      a: "We accept bank transfers (BCA, Mandiri, BNI, BRI), e-wallets (GoPay, OVO, DANA), and credit/debit cards.",
    },
    {
      q: "Is the Free plan really free forever?",
      a: "Yes! The Free plan can be used forever with no time limit. You only need to upgrade if you need more than 5 invoices per month.",
    },
  ];

  function renderLimit(
    key: (typeof comparisonFeatures)[number]["key"],
    limits: (typeof PLANS)[PlanId]["limits"]
  ) {
    const val = limits[key];
    if (typeof val === "boolean") {
      return val ? (
        <Check className="w-5 h-5 text-green-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-300 mx-auto" />
      );
    }
    if (val === -1) return <span className="font-medium">Unlimited</span>;
    return <span className="font-medium">{val}</span>;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="mb-4">
            Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose the Right Plan for Your Business
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free, upgrade as your business grows. No hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.id === "pro"
                    ? "border-blue-500 border-2 shadow-xl scale-105"
                    : "border shadow"
                }`}
              >
                {plan.id === "pro" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? "Free" : formatIDR(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600 ml-1">/month</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className="block mt-6">
                    <Button
                      className="w-full"
                      variant={plan.id === "pro" ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.price === 0 ? "Start Free" : "Choose Plan"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.id}
                      className="py-3 px-4 text-center font-semibold"
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feat) => (
                  <tr key={feat.key} className="border-b">
                    <td className="py-3 px-4 text-gray-700">{feat.label}</td>
                    {plans.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-center">
                        {renderLimit(feat.key, p.limits)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b pb-6">
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Creating Professional Invoices Now
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of Indonesian businesses
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Sign Up Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
