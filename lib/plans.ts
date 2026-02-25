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
    name: "Free",
    description: "For freelancers just getting started",
    price: 0,
    currency: "IDR",
    interval: "month",
    features: [
      "5 invoices per month",
      "10 clients",
      "PDF downloads",
      "Automatic VAT calculation",
      "Auto amount-in-words",
      "Tax ID validation",
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
    description: "For growing businesses",
    price: 99000,
    currency: "IDR",
    interval: "month",
    features: [
      "50 invoices per month",
      "Unlimited clients",
      "PDF downloads",
      "Automatic VAT calculation",
      "Auto amount-in-words",
      "Tax ID validation",
      "Custom branding",
      "Priority support",
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
    name: "Business",
    description: "For companies with large-scale needs",
    price: 299000,
    currency: "IDR",
    interval: "month",
    features: [
      "Unlimited invoices",
      "Unlimited clients",
      "PDF downloads",
      "Automatic VAT calculation",
      "Auto amount-in-words",
      "Tax ID validation",
      "Custom branding",
      "Priority support",
      "Recurring invoices",
      "Multi-currency",
      "5 team members",
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
