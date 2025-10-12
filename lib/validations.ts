/**
 * Validation Schemas for InvoiceFlow
 * Using Zod for type-safe form validation with bilingual error messages
 */

import { z } from 'zod';

// NPWP format: XX.XXX.XXX.X-XXX.XXX
const npwpRegex = /^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/;

/**
 * Invoice Item Schema
 */
export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Deskripsi wajib diisi / Description is required'),
  quantity: z.number().min(0.01, 'Kuantitas harus lebih dari 0 / Quantity must be greater than 0'),
  rate: z.number().min(0.01, 'Harga satuan harus lebih dari 0 / Rate must be greater than 0'),
});

export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;

/**
 * Invoice Schema
 */
export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Nomor invoice wajib diisi / Invoice number is required'),
  clientName: z.string().min(1, 'Nama klien wajib diisi / Client name is required'),
  clientEmail: z.string().email('Email tidak valid / Invalid email').optional().or(z.literal('')),
  clientAddress: z.string().optional(),
  clientNpwp: z.string()
    .regex(npwpRegex, 'Format NPWP tidak valid (XX.XXX.XXX.X-XXX.XXX) / Invalid NPWP format')
    .optional()
    .or(z.literal('')),
  issueDate: z.date({
    required_error: 'Tanggal terbit wajib diisi / Issue date is required',
  }),
  dueDate: z.date({
    required_error: 'Tanggal jatuh tempo wajib diisi / Due date is required',
  }),
  items: z.array(invoiceItemSchema).min(1, 'Minimal satu item diperlukan / At least one item required'),
  ppnRate: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  paymentTerms: z.string().optional(),
}).refine(
  (data) => data.dueDate >= data.issueDate,
  {
    message: 'Tanggal jatuh tempo harus setelah tanggal terbit / Due date must be after issue date',
    path: ['dueDate'],
  }
);

export type InvoiceInput = z.infer<typeof invoiceSchema>;

/**
 * Company Profile Schema
 */
export const companySchema = z.object({
  name: z.string().min(1, 'Nama perusahaan wajib diisi / Company name is required'),
  businessEntity: z.enum(['Perorangan', 'CV', 'PT', 'UD', 'Firma'], {
    errorMap: () => ({ message: 'Pilih bentuk usaha yang valid / Select a valid business entity' }),
  }).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string()
    .email('Email tidak valid / Invalid email')
    .optional()
    .or(z.literal('')),
  npwp: z.string()
    .regex(npwpRegex, 'Format NPWP tidak valid (XX.XXX.XXX.X-XXX.XXX) / Invalid NPWP format')
    .optional()
    .or(z.literal('')),
  isPkp: z.boolean().default(false),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountHolder: z.string().optional(),
  defaultPpnRate: z.number().min(0).max(100).default(11),
});

export type CompanyInput = z.infer<typeof companySchema>;

/**
 * User Registration Schema
 */
export const registerSchema = z.object({
  email: z.string().email('Email tidak valid / Invalid email'),
  password: z.string()
    .min(8, 'Password minimal 8 karakter / Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password harus mengandung huruf besar, kecil, dan angka / Password must contain uppercase, lowercase, and number'
    ),
  confirmPassword: z.string(),
  name: z.string().min(1, 'Nama wajib diisi / Name is required'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Password tidak cocok / Passwords do not match',
    path: ['confirmPassword'],
  }
);

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * User Login Schema
 */
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid / Invalid email'),
  password: z.string().min(1, 'Password wajib diisi / Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Invoice Status Type
 */
export const invoiceStatusEnum = z.enum(['draft', 'sent', 'paid', 'overdue']);
export type InvoiceStatus = z.infer<typeof invoiceStatusEnum>;

