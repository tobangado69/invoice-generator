/**
 * Type definitions matching Prisma schema with Indonesian features
 */

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type BusinessEntity = "Perorangan" | "CV" | "PT" | "UD" | "Firma";

export type CompanyProfile = {
  id: number;
  userId: number;
  name: string;
  businessEntity?: BusinessEntity;
  address?: string;
  phone?: string;
  email?: string;
  npwp?: string; // Format: XX.XXX.XXX.X-XXX.XXX
  isPkp: boolean; // Pengusaha Kena Pajak
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  logoUrl?: string;
  defaultPpnRate: number; // Default 11%
  createdAt: Date;
  updatedAt: Date;
};

export type InvoiceItem = {
  id?: number;
  invoiceId?: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  createdAt?: Date;
};

export type Invoice = {
  id: number;
  userId: number;
  invoiceNumber: string; // Format: INV/2025/10/001
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  clientNpwp?: string; // Client's NPWP (optional)
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  ppnRate: number; // PPN percentage (e.g., 11)
  ppnAmount: number; // Calculated PPN amount
  totalAmount: number;
  amountInWords?: string; // Terbilang in Indonesian
  currency: string; // Default "IDR"
  notes?: string;
  paymentTerms?: string;
  status: InvoiceStatus;
  pdfPath?: string;
  items: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type InvoiceWithCompany = Invoice & {
  company: CompanyProfile;
};

// API Response types
export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
