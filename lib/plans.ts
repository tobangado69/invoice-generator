export type PlanId = "free" | "pro" | "business";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: "month";
  features: string[];
  limits: {
    invoicesPerMonth: number;
    clients: number;
    pdfDownloads: boolean;
    customBranding: boolean;
    prioritySupport: boolean;
    recurringInvoices: boolean;
    multiCurrency: boolean;
    teamMembers: number;
  };
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Gratis",
    description: "Untuk freelancer yang baru memulai",
    price: 0,
    currency: "IDR",
    interval: "month",
    features: [
      "5 invoice per bulan",
      "10 klien",
      "Unduh PDF",
      "Perhitungan PPN otomatis",
      "Terbilang otomatis",
      "Validasi NPWP",
    ],
    limits: {
      invoicesPerMonth: 5,
      clients: 10,
      pdfDownloads: true,
      customBranding: false,
      prioritySupport: false,
      recurringInvoices: false,
      multiCurrency: false,
      teamMembers: 1,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "Untuk bisnis yang berkembang",
    price: 99000,
    currency: "IDR",
    interval: "month",
    features: [
      "50 invoice per bulan",
      "Klien tidak terbatas",
      "Unduh PDF",
      "Perhitungan PPN otomatis",
      "Terbilang otomatis",
      "Validasi NPWP",
      "Branding kustom",
      "Dukungan prioritas",
    ],
    limits: {
      invoicesPerMonth: 50,
      clients: -1,
      pdfDownloads: true,
      customBranding: true,
      prioritySupport: true,
      recurringInvoices: false,
      multiCurrency: false,
      teamMembers: 3,
    },
  },
  business: {
    id: "business",
    name: "Bisnis",
    description: "Untuk perusahaan dengan kebutuhan besar",
    price: 299000,
    currency: "IDR",
    interval: "month",
    features: [
      "Invoice tidak terbatas",
      "Klien tidak terbatas",
      "Unduh PDF",
      "Perhitungan PPN otomatis",
      "Terbilang otomatis",
      "Validasi NPWP",
      "Branding kustom",
      "Dukungan prioritas",
      "Invoice berulang",
      "Multi mata uang",
      "5 anggota tim",
    ],
    limits: {
      invoicesPerMonth: -1,
      clients: -1,
      pdfDownloads: true,
      customBranding: true,
      prioritySupport: true,
      recurringInvoices: true,
      multiCurrency: true,
      teamMembers: 5,
    },
  },
};

export function getPlan(planId: string): Plan {
  return PLANS[planId as PlanId] || PLANS.free;
}

export function canCreateInvoice(plan: Plan, currentMonthCount: number): boolean {
  if (plan.limits.invoicesPerMonth === -1) return true;
  return currentMonthCount < plan.limits.invoicesPerMonth;
}

export function canAddClient(plan: Plan, currentClientCount: number): boolean {
  if (plan.limits.clients === -1) return true;
  return currentClientCount < plan.limits.clients;
}

export function getInvoiceQuota(planId: string): number {
  const plan = getPlan(planId);
  return plan.limits.invoicesPerMonth;
}
