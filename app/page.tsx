"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
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
      title: "Perhitungan PPN Otomatis",
      desc: "Hitung PPN 11% secara otomatis dengan akurat sesuai regulasi Indonesia",
    },
    {
      icon: Shield,
      title: "Kelola NPWP",
      desc: "Tambahkan NPWP perusahaan dan klien dengan validasi otomatis",
    },
    {
      icon: FileText,
      title: "Terbilang Otomatis",
      desc: "Konversi angka ke kata-kata Bahasa Indonesia secara instan",
    },
    {
      icon: Download,
      title: "Unduh PDF Profesional",
      desc: "Ekspor invoice dengan format profesional siap kirim ke klien",
    },
    {
      icon: Users,
      title: "Manajemen Klien",
      desc: "Database klien terintegrasi untuk pengisian invoice otomatis",
    },
    {
      icon: BarChart3,
      title: "Dashboard Analitik",
      desc: "Pantau pendapatan, status pembayaran, dan tren bisnis Anda",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Daftar Gratis",
      desc: "Buat akun dalam 30 detik tanpa kartu kredit",
    },
    {
      number: "2",
      title: "Atur Profil Bisnis",
      desc: "Masukkan NPWP, rekening bank, dan info perusahaan",
    },
    {
      number: "3",
      title: "Buat & Kirim Invoice",
      desc: "Buat invoice profesional dan unduh PDF dalam hitungan menit",
    },
  ];

  const testimonials = [
    {
      name: "Rina Sari",
      role: "Freelance Designer",
      text: "InvoiceFlow menghemat waktu saya 2 jam setiap minggu. Perhitungan PPN otomatis dan terbilang sangat membantu!",
      rating: 5,
    },
    {
      name: "Ahmad Fauzi",
      role: "Owner, CV Maju Bersama",
      text: "Akhirnya ada invoice generator yang benar-benar paham kebutuhan bisnis Indonesia. NPWP, PPN, semua lengkap.",
      rating: 5,
    },
    {
      name: "Dewi Lestari",
      role: "Akuntan, PT Digital Nusantara",
      text: "Fitur manajemen klien dan dashboard analitik sangat membantu untuk tracking pembayaran. Sangat direkomendasikan!",
      rating: 5,
    },
  ];

  const stats = [
    { value: "5.000+", label: "Invoice Dibuat" },
    { value: "1.200+", label: "Pengguna Aktif" },
    { value: "Rp 15M+", label: "Total Transaksi" },
    { value: "99.9%", label: "Uptime" },
  ];

  const plans = Object.values(PLANS);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm font-medium text-blue-700 mb-6">
            <Zap className="w-4 h-4" />
            <span>Platform Invoice #1 untuk UMKM Indonesia</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Buat Invoice Profesional
            <br />
            <span className="text-blue-600">dalam Hitungan Menit</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Platform invoicing lengkap dengan PPN, NPWP, terbilang, dan
            manajemen klien. Sempurna untuk freelancer, UMKM, dan perusahaan
            Indonesia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 h-14">
                Mulai Gratis Sekarang
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 h-14"
              >
                Lihat Harga
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Tanpa kartu kredit &bull; 5 invoice gratis per bulan &bull; Upgrade
            kapan saja
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">
                  {stat.value}
                </div>
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
            <Badge variant="outline" className="mb-4">
              Fitur Lengkap
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Semua yang Anda Butuhkan untuk Invoice Profesional
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dirancang khusus untuk kebutuhan bisnis Indonesia dengan fitur
              perpajakan lengkap
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow border-0 shadow-sm"
                >
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mulai dalam 3 Langkah Mudah
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                  {step.number}
                </div>
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
            <Badge variant="outline" className="mb-4">
              Harga Transparan
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pilih Paket yang Sesuai
            </h2>
            <p className="text-gray-600">
              Mulai gratis, upgrade sesuai kebutuhan bisnis Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                      Paling Populer
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? "Gratis" : formatIDR(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600 ml-1">/bulan</span>
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
                    >
                      {plan.price === 0 ? "Mulai Gratis" : "Pilih Paket"}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dipercaya oleh Ribuan Bisnis Indonesia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Tingkatkan Bisnis Anda?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabung dengan ribuan bisnis Indonesia yang sudah menggunakan
            InvoiceFlow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Daftar Gratis Sekarang
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          <p className="text-sm opacity-70 mt-4">
            Tanpa kartu kredit &bull; Batal kapan saja
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-3">Produk</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/#pricing" className="hover:text-white">
                    Harga
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white">
                    Daftar
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    Masuk
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Fitur</h4>
              <ul className="space-y-2 text-sm">
                <li>Perhitungan PPN</li>
                <li>Validasi NPWP</li>
                <li>Terbilang Otomatis</li>
                <li>Unduh PDF</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Perusahaan</h4>
              <ul className="space-y-2 text-sm">
                <li>Tentang Kami</li>
                <li>Blog</li>
                <li>Kontak</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>Kebijakan Privasi</li>
                <li>Syarat & Ketentuan</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 InvoiceFlow. Platform Invoice untuk UMKM Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
