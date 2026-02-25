"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calculator,
  Download,
  Shield,
  Zap,
  ArrowRight,
  Users,
  BarChart3,
  Star,
  Check,
} from "lucide-react";
import { PLANS } from "@/lib/plans";
import { formatIDR } from "@/lib/indonesian-utils";

export default function LandingPage() {
  const features = [
    {
      icon: Calculator,
      title: "Automatic VAT Calculation",
      desc: "Calculate 11% VAT (PPN) automatically and accurately per Indonesian regulations",
    },
    {
      icon: Shield,
      title: "Tax ID Management",
      desc: "Add and validate company and client NPWP tax IDs with auto-formatting",
    },
    {
      icon: FileText,
      title: "Amount in Words",
      desc: "Instantly convert amounts to words in Bahasa Indonesia (terbilang)",
    },
    {
      icon: Download,
      title: "Professional PDF Export",
      desc: "Export invoices as professional PDF documents ready to send to clients",
    },
    {
      icon: Users,
      title: "Client Management",
      desc: "Integrated client database for quick invoice creation and auto-fill",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      desc: "Monitor revenue, payment status, and business trends at a glance",
    },
  ];

  const steps = [
    { number: "1", title: "Sign Up Free", desc: "Create an account in 30 seconds — no credit card required" },
    { number: "2", title: "Set Up Your Profile", desc: "Enter your tax ID, bank account, and company details" },
    { number: "3", title: "Create & Send Invoices", desc: "Build professional invoices and download PDFs in minutes" },
  ];

  const testimonials = [
    { name: "Rina Sari", role: "Freelance Designer", text: "InvoiceFlow saves me 2 hours every week. Automatic VAT calculation and amount-in-words are a lifesaver!", rating: 5 },
    { name: "Ahmad Fauzi", role: "Owner, CV Maju Bersama", text: "Finally an invoice generator that truly understands Indonesian business needs. Tax ID, VAT, everything is covered.", rating: 5 },
    { name: "Dewi Lestari", role: "Accountant, PT Digital Nusantara", text: "The client management and analytics dashboard are incredibly helpful for tracking payments. Highly recommended!", rating: 5 },
  ];

  const stats = [
    { value: "5,000+", label: "Invoices Created" },
    { value: "1,200+", label: "Active Users" },
    { value: "Rp 15B+", label: "Total Transactions" },
    { value: "99.9%", label: "Uptime" },
  ];

  const plans = Object.values(PLANS);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm font-medium text-blue-700 mb-6">
            <Zap className="w-4 h-4" />
            <span>#1 Invoice Platform for Indonesian Businesses</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create Professional Invoices
            <br />
            <span className="text-blue-600">in Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Complete invoicing platform with VAT, tax ID, amount-in-words, and client management.
            Perfect for freelancers, SMEs, and Indonesian businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 h-14">
                Start Free Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required &bull; 5 free invoices per month &bull; Upgrade anytime
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Full Featured</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for Professional Invoicing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Built specifically for Indonesian business needs with complete tax compliance features</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-sm">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started in 3 Easy Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white" id="pricing">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Transparent Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose the Right Plan</h2>
            <p className="text-gray-600">Start free, upgrade as your business grows</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.id === "pro" ? "border-blue-500 border-2 shadow-xl scale-105" : "border shadow"}`}>
                {plan.id === "pro" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">{plan.price === 0 ? "Free" : formatIDR(plan.price)}</span>
                    {plan.price > 0 && <span className="text-gray-600 ml-1">/month</span>}
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
                    <Button className="w-full" variant={plan.id === "pro" ? "default" : "outline"}>
                      {plan.price === 0 ? "Start Free" : "Choose Plan"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Thousands of Indonesian Businesses</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of Indonesian businesses already using InvoiceFlow</p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Sign Up Free Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-sm opacity-70 mt-4">No credit card required &bull; Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/register" className="hover:text-white">Sign Up</Link></li>
                <li><Link href="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Features</h4>
              <ul className="space-y-2 text-sm">
                <li>VAT Calculation</li>
                <li>Tax ID Validation</li>
                <li>Amount in Words</li>
                <li>PDF Export</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>About Us</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 InvoiceFlow. Professional Invoice Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
