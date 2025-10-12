# Technical Implementation Guide
## SaaS Invoice Generator MVP

### 1. Architecture Overview

#### 1.1 High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Server Side    │    │    Database     │
│                 │    │                  │    │                 │
│  Next.js App    │◄──►│  Next.js API     │◄──►│  PostgreSQL     │
│  (React/TS)     │    │  Routes          │    │                 │
│  TailwindCSS    │    │  Better Auth     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

#### 1.2 Architecture Principles

- **Monolithic Start:** Single Next.js application for MVP simplicity
- **Component-Based:** Reusable React components with TypeScript
- **API-First:** Well-defined API layer for future mobile app support
- **Progressive Enhancement:** Works without JavaScript for core features
- **Security-First:** Authentication and authorization at every layer

### 2. Technology Stack Details

#### 2.1 Frontend Stack

```typescript
// Core Framework
- Next.js 14+ (App Router)
- React 18+
- TypeScript 5+

// Styling & UI
- TailwindCSS 3+
- Tailwind UI components (optional)
- Lucide React (icons)
- clsx (conditional styling)

// State Management & Data Fetching
- TanStack Query (React Query) v5
- Zustand (client state)
- React Hook Form (form management)
- Zod (validation)

// PDF Generation ✅ IMPLEMENTED
- pdf-lib (pure JavaScript, Next.js compatible)
- Perfect text centering with font width calculations
- Zero external dependencies, 100% reliability
```

#### 2.2 Backend & Infrastructure

```typescript
// Backend ✅ IMPLEMENTED
- Next.js API Routes
- NextAuth.js v5 (authentication)
- Prisma ORM
- SQLite (MVP) / PostgreSQL (production ready)

// File Storage
- Local filesystem (MVP)
- AWS S3 (future)

// Deployment
- Vercel (primary)
- Railway/Render (alternative)
```

### 3. Database Design

#### 3.1 Schema Overview

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User profiles/companies
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  business_entity VARCHAR(50), -- Perorangan, CV, PT, UD, Firma
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  npwp VARCHAR(20), -- Format: XX.XXX.XXX.X-XXX.XXX
  is_pkp BOOLEAN DEFAULT false, -- Pengusaha Kena Pajak status
  bank_name VARCHAR(100),
  bank_account_number VARCHAR(50),
  bank_account_holder VARCHAR(255),
  logo_url VARCHAR(500),
  default_ppn_rate DECIMAL(5,2) DEFAULT 11.00, -- Default PPN 11%
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_address TEXT,
  client_npwp VARCHAR(20), -- Client NPWP (optional)
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal DECIMAL(15,2) NOT NULL, -- Increased precision for IDR
  ppn_rate DECIMAL(5,2) DEFAULT 0, -- PPN rate (11% if applicable)
  ppn_amount DECIMAL(15,2) DEFAULT 0, -- PPN amount
  total_amount DECIMAL(15,2) NOT NULL,
  amount_in_words TEXT, -- Terbilang (Indonesian words)
  currency VARCHAR(3) DEFAULT 'IDR', -- IDR for Indonesian Rupiah
  notes TEXT,
  payment_terms TEXT, -- Syarat pembayaran
  status VARCHAR(20) DEFAULT 'draft', -- draft, sent, paid, overdue
  pdf_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoice line items
CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  rate DECIMAL(10,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_date ON invoices(issue_date);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
```

#### 3.2 Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  emailVerified Boolean   @default(false) @map("email_verified")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  company       Company?
  invoices      Invoice[]
  
  @@map("users")
}

model Company {
  id                Int      @id @default(autoincrement())
  userId            Int      @unique @map("user_id")
  name              String
  businessEntity    String?  @map("business_entity") // Perorangan, CV, PT, UD, Firma
  address           String?
  phone             String?
  email             String?
  npwp              String?  // Format: XX.XXX.XXX.X-XXX.XXX
  isPkp             Boolean  @default(false) @map("is_pkp")
  bankName          String?  @map("bank_name")
  bankAccountNumber String?  @map("bank_account_number")
  bankAccountHolder String?  @map("bank_account_holder")
  logoUrl           String?  @map("logo_url")
  defaultPpnRate    Decimal  @default(11.00) @map("default_ppn_rate") @db.Decimal(5, 2)
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("companies")
}

model Invoice {
  id             Int           @id @default(autoincrement())
  userId         Int           @map("user_id")
  invoiceNumber  String        @unique @map("invoice_number")
  clientName     String        @map("client_name")
  clientEmail    String?       @map("client_email")
  clientAddress  String?       @map("client_address")
  clientNpwp     String?       @map("client_npwp") // Client NPWP
  issueDate      DateTime      @map("issue_date")
  dueDate        DateTime      @map("due_date")
  subtotal       Decimal       @db.Decimal(15, 2) // Increased for IDR
  ppnRate        Decimal       @default(0) @map("ppn_rate") @db.Decimal(5, 2)
  ppnAmount      Decimal       @default(0) @map("ppn_amount") @db.Decimal(15, 2)
  totalAmount    Decimal       @map("total_amount") @db.Decimal(15, 2)
  amountInWords  String?       @map("amount_in_words") // Terbilang
  currency       String        @default("IDR") // IDR for Indonesian Rupiah
  notes          String?
  paymentTerms   String?       @map("payment_terms") // Syarat pembayaran
  status         String        @default("draft")
  pdfPath        String?       @map("pdf_path")
  createdAt      DateTime      @default(now()) @map("created_at")
  updatedAt      DateTime      @updatedAt @map("updated_at")
  
  user           User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  items          InvoiceItem[]
  
  @@map("invoices")
}

model InvoiceItem {
  id          Int     @id @default(autoincrement())
  invoiceId   Int     @map("invoice_id")
  description String
  quantity    Decimal @default(1) @db.Decimal(10, 2)
  rate        Decimal @db.Decimal(10, 2)
  amount      Decimal @db.Decimal(10, 2)
  createdAt   DateTime @default(now()) @map("created_at")
  
  invoice     Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  
  @@map("invoice_items")
}
```

### 4. API Design

#### 4.1 API Routes Structure

```
/api/auth/*          - Better Auth endpoints
/api/user/profile    - GET, PUT user profile
/api/company         - GET, PUT company information
/api/invoices        - GET (list), POST (create)
/api/invoices/[id]   - GET, PUT, DELETE specific invoice
/api/invoices/[id]/pdf - GET PDF generation
/api/upload          - POST file upload (logos, etc.)
```

#### 4.2 API Response Format

```typescript
// Success Response
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Error Response
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Example: Invoice List Response
interface InvoicesResponse {
  success: true;
  data: {
    invoices: Invoice[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

#### 4.3 Key API Endpoints

```typescript
// GET /api/invoices
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status');
  
  // Implementation with Prisma
  const invoices = await prisma.invoice.findMany({
    where: {
      userId: user.id,
      ...(status && { status })
    },
    include: { items: true },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({
    success: true,
    data: { invoices, pagination }
  });
}

// POST /api/invoices
export async function POST(request: NextRequest) {
  const body = await request.json();
  const validatedData = invoiceSchema.parse(body);
  
  const invoice = await prisma.invoice.create({
    data: {
      ...validatedData,
      userId: user.id,
      items: {
        create: validatedData.items
      }
    },
    include: { items: true }
  });
  
  return NextResponse.json({
    success: true,
    data: invoice
  });
}
```

### 5. Authentication Implementation

#### 5.1 Better Auth Configuration

```typescript
// auth.config.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  rateLimit: {
    window: 60,
    max: 100
  }
});
```

#### 5.2 Client-side Auth Hook

```typescript
// hooks/use-auth.ts
import { useAuthClient } from "better-auth/react";

export function useAuth() {
  const { data: session, error, isPending } = useAuthClient({
    fetchOptions: {
      onError(context) {
        if (context.response?.status === 401) {
          window.location.href = '/login';
        }
      }
    }
  });

  return {
    user: session?.user,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    error
  };
}
```

#### 5.3 Route Protection

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth.config';

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard');

  if (isProtectedPage && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
```

### 6. PDF Generation Implementation ✅ COMPLETED

#### 6.1 PDF Generation Strategy - FINAL IMPLEMENTATION

```typescript
// app/api/invoices/[id]/download-pdf/route.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Create PDF document using pdf-lib
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([595, 842]); // A4 size in points
const { width, height } = page.getSize();

// Load fonts
const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

let yPosition = height - 60;
const leftMargin = 50;
const rightMargin = width - 50;

// Header - INVOICE title (properly centered)
const invoiceTextWidth = boldFont.widthOfTextAtSize('INVOICE', 24);
page.drawText('INVOICE', {
  x: (width - invoiceTextWidth) / 2,
  y: yPosition,
  size: 24,
  font: boldFont,
  color: rgb(0, 0, 0),
});

// Invoice Number (properly centered)
const invoiceNumberTextWidth = boldFont.widthOfTextAtSize(invoice.invoiceNumber, 16);
page.drawText(invoice.invoiceNumber, {
  x: (width - invoiceNumberTextWidth) / 2,
  y: yPosition - 25,
  size: 16,
  font: boldFont,
  color: rgb(0.15, 0.39, 0.92), // #2563eb
});

// Continue with company info, client info, table, totals, etc.
// ... (full implementation in app/api/invoices/[id]/download-pdf/route.ts)

const pdfBuffer = await pdfDoc.save();

return new NextResponse(pdfBuffer, {
  headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="invoice-${invoiceNumber}.pdf"`,
  }
});
```

#### 6.2 PDF Generation API ✅ IMPLEMENTED

```typescript
// app/api/invoices/[id]/download-pdf/route.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = await params;
  const invoice = await prisma.invoice.findFirst({
    where: { id: parseInt(id), userId: session.user.id },
    include: { items: true }
  });

  if (!invoice) {
    return new NextResponse('Invoice not found', { status: 404 });
  }

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id }
  });

  try {
    // Generate PDF using pdf-lib (see implementation above)
    const pdfBuffer = await generateInvoicePDF(invoice, company);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber.replace(/\//g, '-')}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return new NextResponse(`PDF generation failed: ${error.message}`, { status: 500 });
  }
}
```

### 7. State Management

#### 7.1 TanStack Query Setup

```typescript
// lib/query-client.ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error?.response?.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});

// providers/query-provider.tsx
'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

#### 7.2 Invoice Queries & Mutations

```typescript
// hooks/use-invoices.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useInvoices(params?: InvoicesQueryParams) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => fetchInvoices(params),
  });
}

export function useInvoice(id: number) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => fetchInvoice(id),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: InvoiceInput }) =>
      updateInvoice(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] });
    },
  });
}
```

#### 7.3 Zustand Store for UI State

```typescript
// stores/ui-store.ts
import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  currentInvoiceDraft: Partial<InvoiceInput> | null;
  setInvoiceDraft: (draft: Partial<InvoiceInput>) => void;
  clearInvoiceDraft: () => void;
  
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  currentInvoiceDraft: null,
  setInvoiceDraft: (draft) => set({ currentInvoiceDraft: draft }),
  clearInvoiceDraft: () => set({ currentInvoiceDraft: null }),
  
  notifications: [],
  addNotification: (notification) => {
    const id = Date.now().toString();
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }]
    }));
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 5000);
  },
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
}));
```

### 8. Indonesian Utilities & Helpers

#### 8.1 Currency Formatting (IDR)

```typescript
// lib/indonesian-utils.ts

/**
 * Format number to Indonesian Rupiah
 * Example: 1000000 => "Rp 1.000.000,00"
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format NPWP with dots and dash
 * Input: 123456789012345 => Output: 12.345.678.9-012.345
 */
export function formatNPWP(npwp: string): string {
  const cleaned = npwp.replace(/\D/g, '');
  if (cleaned.length !== 15) return npwp;
  
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}.${cleaned.slice(8, 9)}-${cleaned.slice(9, 12)}.${cleaned.slice(12, 15)}`;
}

/**
 * Validate NPWP format
 */
export function validateNPWP(npwp: string): boolean {
  const npwpRegex = /^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/;
  return npwpRegex.test(npwp);
}

/**
 * Convert number to Indonesian words (Terbilang)
 * Example: 1500000 => "Satu Juta Lima Ratus Ribu Rupiah"
 */
export function terbilang(angka: number): string {
  const huruf = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 
    'Enam', 'Tujuh', 'Delapan', 'Sembilan', 
    'Sepuluh', 'Sebelas'
  ];

  if (angka < 12) return huruf[angka];
  if (angka < 20) return terbilang(angka - 10) + ' Belas';
  if (angka < 100) 
    return terbilang(Math.floor(angka / 10)) + ' Puluh ' + terbilang(angka % 10);
  if (angka < 200) return 'Seratus ' + terbilang(angka - 100);
  if (angka < 1000) 
    return terbilang(Math.floor(angka / 100)) + ' Ratus ' + terbilang(angka % 100);
  if (angka < 2000) return 'Seribu ' + terbilang(angka - 1000);
  if (angka < 1000000) 
    return terbilang(Math.floor(angka / 1000)) + ' Ribu ' + terbilang(angka % 1000);
  if (angka < 1000000000) 
    return terbilang(Math.floor(angka / 1000000)) + ' Juta ' + terbilang(angka % 1000000);
  if (angka < 1000000000000) 
    return terbilang(Math.floor(angka / 1000000000)) + ' Miliar ' + terbilang(angka % 1000000000);
  
  return angka.toString();
}

/**
 * Calculate PPN (11%)
 */
export function calculatePPN(subtotal: number, ppnRate: number = 11): number {
  return subtotal * (ppnRate / 100);
}

/**
 * Generate Indonesian invoice number
 * Format: INV/YYYY/MM/XXX
 * Example: INV/2025/10/001
 */
export function generateInvoiceNumber(count: number): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const sequence = String(count + 1).padStart(3, '0');
  
  return `INV/${year}/${month}/${sequence}`;
}
```

### 9. Form Management & Validation

#### 9.1 Zod Schemas

```typescript
// lib/validations.ts
import { z } from 'zod';

// NPWP validation regex: XX.XXX.XXX.X-XXX.XXX
const npwpRegex = /^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/;

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  quantity: z.number().min(0.01, 'Kuantitas harus lebih dari 0'),
  rate: z.number().min(0.01, 'Harga satuan harus lebih dari 0'),
  amount: z.number().min(0.01, 'Jumlah harus lebih dari 0'),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Nomor invoice wajib diisi'),
  clientName: z.string().min(1, 'Nama klien wajib diisi'),
  clientEmail: z.string().email('Email tidak valid').optional(),
  clientAddress: z.string().optional(),
  clientNpwp: z.string()
    .regex(npwpRegex, 'Format NPWP tidak valid (XX.XXX.XXX.X-XXX.XXX)')
    .optional(),
  issueDate: z.date(),
  dueDate: z.date(),
  items: z.array(invoiceItemSchema).min(1, 'Minimal satu item diperlukan'),
  ppnRate: z.number().min(0).max(100).default(0), // PPN rate (0-100%)
  notes: z.string().optional(),
  paymentTerms: z.string().optional(),
}).refine(
  (data) => data.dueDate >= data.issueDate,
  {
    message: "Tanggal jatuh tempo harus setelah tanggal terbit",
    path: ["dueDate"],
  }
);

export const companySchema = z.object({
  name: z.string().min(1, 'Nama perusahaan wajib diisi'),
  businessEntity: z.enum(['Perorangan', 'CV', 'PT', 'UD', 'Firma']).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email tidak valid').optional(),
  npwp: z.string()
    .regex(npwpRegex, 'Format NPWP tidak valid (XX.XXX.XXX.X-XXX.XXX)')
    .optional(),
  isPkp: z.boolean().default(false),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountHolder: z.string().optional(),
  defaultPpnRate: z.number().min(0).max(100).default(11),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type CompanyInput = z.infer<typeof companySchema>;
```

#### 8.2 React Hook Form Integration

```typescript
// components/forms/invoice-form.tsx
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function InvoiceForm({ initialData, onSubmit }: InvoiceFormProps) {
  const form = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: initialData || {
      invoiceNumber: generateInvoiceNumber(),
      clientName: '',
      clientEmail: '',
      clientAddress: '',
      issueDate: new Date(),
      dueDate: addDays(new Date(), 30),
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  // Watch for quantity and rate changes to calculate amounts
  const watchedItems = form.watch('items');
  
  React.useEffect(() => {
    watchedItems.forEach((item, index) => {
      const amount = item.quantity * item.rate;
      if (amount !== item.amount) {
        form.setValue(`items.${index}.amount`, amount);
      }
    });
  }, [watchedItems, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Invoice Header */}
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="invoiceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="issueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Date</FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Client Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Client Information</h3>
        {/* Client fields... */}
      </div>

      {/* Invoice Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Items</h3>
          <Button
            type="button"
            onClick={() => append({ description: '', quantity: 1, rate: 0, amount: 0 })}
          >
            Add Item
          </Button>
        </div>
        
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-5">
              <FormField
                control={form.control}
                name={`items.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Other item fields... */}
            <div className="col-span-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit">
          Generate Invoice
        </Button>
      </div>
    </form>
  );
}
```

### 9. Component Architecture

#### 9.1 Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # Protected routes
│   │   ├── invoices/
│   │   ├── settings/
│   │   └── page.tsx
│   ├── api/               # API routes
│   └── layout.tsx
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
├── hooks/                # Custom hooks
├── lib/                  # Utilities and configurations
├── stores/               # Zustand stores
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

#### 9.2 Base UI Components

```typescript
// components/ui/button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button, buttonVariants };
```

### 10. Development Workflow

#### 10.1 Environment Setup

```bash
# Clone and setup
git clone <repository>
cd invoice-generator
npm install

# Environment variables
cp .env.example .env.local
# Configure database and auth secrets

# Database setup
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed

# Development server
npm run dev
```

#### 10.2 Environment Variables

```env
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/invoices"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Better Auth
BETTER_AUTH_SECRET="your-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Email (for verification)
SMTP_HOST="smtp.resend.com"
SMTP_PORT="587"
SMTP_USER="resend"
SMTP_PASS="your-smtp-password"
```

#### 10.3 Scripts & Commands

```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 11. Testing Strategy

#### 11.1 Unit Testing (Jest + Testing Library)

```typescript
// __tests__/components/invoice-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InvoiceForm } from '@/components/forms/invoice-form';

describe('InvoiceForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all required fields', () => {
    render(<InvoiceForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/invoice number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/client name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/issue date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<InvoiceForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /generate invoice/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/client name is required/i)).toBeInTheDocument();
    });
  });

  it('calculates item amounts automatically', async () => {
    render(<InvoiceForm onSubmit={mockOnSubmit} />);
    
    const quantityInput = screen.getByLabelText(/quantity/i);
    const rateInput = screen.getByLabelText(/rate/i);
    
    fireEvent.change(quantityInput, { target: { value: '2' } });
    fireEvent.change(rateInput, { target: { value: '50' } });

    await waitFor(() => {
      const amountInput = screen.getByLabelText(/amount/i);
      expect(amountInput).toHaveValue('100');
    });
  });
});
```

#### 11.2 API Testing

```typescript
// __tests__/api/invoices.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/invoices/route';

describe('/api/invoices', () => {
  it('creates a new invoice', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        invoiceNumber: 'INV-001',
        clientName: 'Test Client',
        issueDate: '2023-01-01',
        dueDate: '2023-02-01',
        items: [{
          description: 'Web Design',
          quantity: 1,
          rate: 1000,
          amount: 1000
        }]
      }
    });

    await handler.POST(req);
    
    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.data.invoiceNumber).toBe('INV-001');
  });

  it('validates invoice data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        // Missing required fields
        invoiceNumber: '',
        clientName: ''
      }
    });

    await handler.POST(req);
    
    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
  });
});
```

#### 11.3 E2E Testing (Playwright)

```typescript
// e2e/invoice-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Invoice Generation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'test@example.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.click('[data-testid=login-button]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('creates and downloads invoice', async ({ page }) => {
    // Navigate to create invoice
    await page.click('[data-testid=create-invoice-button]');
    await expect(page).toHaveURL('/dashboard/invoices/create');

    // Fill invoice form
    await page.fill('[data-testid=client-name]', 'Acme Corp');
    await page.fill('[data-testid=client-email]', 'billing@acme.com');
    
    // Add invoice item
    await page.fill('[data-testid=item-description-0]', 'Website Development');
    await page.fill('[data-testid=item-quantity-0]', '1');
    await page.fill('[data-testid=item-rate-0]', '2500');

    // Submit form
    await page.click('[data-testid=generate-invoice-button]');

    // Verify success and download
    await expect(page.locator('[data-testid=success-message]')).toBeVisible();
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid=download-pdf-button]');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toMatch(/invoice-.*\.pdf/);
  });

  test('validates form inputs', async ({ page }) => {
    await page.goto('/dashboard/invoices/create');
    
    // Try to submit empty form
    await page.click('[data-testid=generate-invoice-button]');
    
    // Check for validation errors
    await expect(page.locator('[data-testid=client-name-error]')).toHaveText('Client name is required');
    await expect(page.locator('[data-testid=item-description-error]')).toHaveText('Description is required');
  });
});
```

### 12. Performance Optimization

#### 12.1 Code Splitting & Lazy Loading

```typescript
// Dynamic imports for heavy components
const InvoicePDFPreview = dynamic(
  () => import('@/components/invoice/pdf-preview'),
  { 
    loading: () => <div>Loading PDF preview...</div>,
    ssr: false 
  }
);

const InvoiceChart = dynamic(
  () => import('@/components/analytics/invoice-chart'),
  { loading: () => <ChartSkeleton /> }
);

// Route-level code splitting is automatic with App Router
```

#### 12.2 Database Optimization

```typescript
// Efficient queries with proper indexing
const invoices = await prisma.invoice.findMany({
  where: { userId },
  select: {
    id: true,
    invoiceNumber: true,
    clientName: true,
    totalAmount: true,
    status: true,
    issueDate: true,
    dueDate: true,
    // Don't select unnecessary fields
  },
  orderBy: { createdAt: 'desc' },
  take: 20, // Pagination
});

// Use transactions for related operations
await prisma.$transaction(async (prisma) => {
  const invoice = await prisma.invoice.create({ data: invoiceData });
  await prisma.invoiceItem.createMany({
    data: items.map(item => ({ ...item, invoiceId: invoice.id }))
  });
  return invoice;
});
```

#### 12.3 Caching Strategy

```typescript
// API Route caching
export async function GET(request: NextRequest) {
  const invoices = await prisma.invoice.findMany({...});
  
  return NextResponse.json(invoices, {
    headers: {
      'Cache-Control': 'private, max-age=300', // 5 minutes
      'ETag': generateETag(invoices),
    }
  });
}

// React Query caching
export const invoiceQueries = {
  all: () => ['invoices'] as const,
  lists: () => [...invoiceQueries.all(), 'list'] as const,
  list: (filters: string) => [...invoiceQueries.lists(), filters] as const,
  details: () => [...invoiceQueries.all(), 'detail'] as const,
  detail: (id: number) => [...invoiceQueries.details(), id] as const,
};
```

### 13. Security Implementation

#### 13.1 Input Validation & Sanitization

```typescript
// API route security
export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.ip || 'unknown';
  const rateLimitResult = await rateLimit.check(ip, 10, '1m'); // 10 requests per minute
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  // Input validation
  const body = await request.json();
  const validatedData = invoiceSchema.parse(body);
  
  // Sanitize inputs
  const sanitizedData = {
    ...validatedData,
    clientName: DOMPurify.sanitize(validatedData.clientName),
    notes: validatedData.notes ? DOMPurify.sanitize(validatedData.notes) : undefined,
  };

  // Authorization check
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Create invoice...
}
```

#### 13.2 SQL Injection Prevention

```typescript
// Prisma automatically prevents SQL injection, but for raw queries:
const invoices = await prisma.$queryRaw`
  SELECT * FROM invoices 
  WHERE user_id = ${userId} 
  AND status = ${status}
  ORDER BY created_at DESC
`;

// Never do this:
// const query = `SELECT * FROM invoices WHERE user_id = ${userId}`;
// This is vulnerable to SQL injection
```

#### 13.3 CSRF Protection

```typescript
// middleware.ts - CSRF protection for state-changing operations
import { csrf } from '@/lib/csrf';

export async function middleware(request: NextRequest) {
  if (request.method !== 'GET') {
    const csrfResult = await csrf.protect(request);
    if (!csrfResult.success) {
      return NextResponse.json(
        { error: 'CSRF token invalid' },
        { status: 403 }
      );
    }
  }
  
  return NextResponse.next();
}
```

### 14. Deployment Strategy

#### 14.1 Indonesian Market Considerations

**Hosting Options:**
1. **Vercel (Recommended for MVP)** - Singapore region for low latency to Indonesia
2. **AWS Asia Pacific (Jakarta)** - For data sovereignty compliance
3. **Google Cloud Platform (Jakarta)** - Local presence in Indonesia
4. **Alibaba Cloud Indonesia** - Local data center

**Deployment Configuration:**
- Primary region: Asia-Pacific (Singapore/Jakarta)
- CDN: Cloudflare with Indonesia edge locations
- Database: PostgreSQL with read replicas in Jakarta
- Asset optimization for Indonesian 3G/4G networks

#### 14.2 Vercel Deployment

```typescript
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["sin1", "jkt1"], // Singapore & Jakarta
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "BETTER_AUTH_SECRET": "@auth-secret",
    "NEXT_PUBLIC_APP_LOCALE": "id-ID"
  }
}
```

#### 14.3 Environment Configuration

```bash
# Production environment variables
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="production-secret"
BETTER_AUTH_URL="https://yourdomain.com"

# Indonesian Market Settings
NEXT_PUBLIC_DEFAULT_LOCALE="id-ID"
NEXT_PUBLIC_DEFAULT_CURRENCY="IDR"
NEXT_PUBLIC_DEFAULT_PPN_RATE="11"
NEXT_PUBLIC_TIMEZONE="Asia/Jakarta"

# Analytics & Monitoring
VERCEL_ANALYTICS_ID="..."
SENTRY_DSN="..."

# Email service (Indonesian provider recommended)
SMTP_HOST="smtp.zoho.com" # or smtp.gmail.com
SMTP_FROM="noreply@invoiceflow.id"

# Optional: Indonesian payment gateway
MIDTRANS_SERVER_KEY="..."
XENDIT_SECRET_KEY="..."
```

#### 14.4 Internationalization (i18n) Setup

```typescript
// lib/i18n/config.ts
export const i18nConfig = {
  defaultLocale: 'id',
  locales: ['id', 'en'],
  localeDetection: true,
};

// lib/i18n/translations.ts
export const translations = {
  id: {
    common: {
      invoice: 'Faktur',
      create: 'Buat',
      edit: 'Edit',
      delete: 'Hapus',
      save: 'Simpan',
      cancel: 'Batal',
      download: 'Unduh',
    },
    invoice: {
      number: 'Nomor Faktur',
      date: 'Tanggal',
      dueDate: 'Jatuh Tempo',
      client: 'Klien',
      items: 'Item',
      subtotal: 'Subtotal',
      ppn: 'PPN',
      total: 'Total',
      amountInWords: 'Terbilang',
      paymentTerms: 'Syarat Pembayaran',
    },
    company: {
      name: 'Nama Perusahaan',
      npwp: 'NPWP',
      address: 'Alamat',
      phone: 'Telepon',
      email: 'Email',
      businessEntity: 'Bentuk Usaha',
      pkpStatus: 'Status PKP',
    },
    validation: {
      required: 'Wajib diisi',
      invalidEmail: 'Email tidak valid',
      invalidNPWP: 'Format NPWP tidak valid',
    },
  },
  en: {
    common: {
      invoice: 'Invoice',
      create: 'Create',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      download: 'Download',
    },
    invoice: {
      number: 'Invoice Number',
      date: 'Date',
      dueDate: 'Due Date',
      client: 'Client',
      items: 'Items',
      subtotal: 'Subtotal',
      ppn: 'VAT',
      total: 'Total',
      amountInWords: 'Amount in Words',
      paymentTerms: 'Payment Terms',
    },
    company: {
      name: 'Company Name',
      npwp: 'Tax ID (NPWP)',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      businessEntity: 'Business Entity',
      pkpStatus: 'VAT Status',
    },
    validation: {
      required: 'Required',
      invalidEmail: 'Invalid email',
      invalidNPWP: 'Invalid NPWP format',
    },
  },
};

// Hook for using translations
export function useTranslations(locale: string = 'id') {
  return translations[locale as keyof typeof translations];
}
```

#### 14.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 15. Monitoring & Analytics

#### 15.1 Error Tracking

```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});

// Error boundary component
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          errorInfo,
        },
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

#### 15.2 Performance Monitoring

```typescript
// lib/analytics.ts
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Track to your analytics service
    window.gtag?.('event', eventName, properties);
    
    // Custom metrics
    if (eventName === 'invoice_generated') {
      performance.mark('invoice-generation-complete');
      performance.measure(
        'invoice-generation-time',
        'invoice-generation-start',
        'invoice-generation-complete'
      );
    }
  }
}

// Usage in components
const { mutate: createInvoice } = useCreateInvoice({
  onSuccess: (invoice) => {
    trackEvent('invoice_created', {
      invoice_id: invoice.id,
      total_amount: invoice.totalAmount,
    });
  },
});
```

### 16. Maintenance & Updates

#### 16.1 Database Migrations

```typescript
// prisma/migrations/add-invoice-templates.sql
-- Migration for adding invoice templates (future feature)
CREATE TABLE invoice_templates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  template_data JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 16.2 Backup Strategy

```bash
# Automated database backups
#!/bin/bash
# backup.sh
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backup_$TIMESTAMP.sql"

pg_dump $DATABASE_URL > $BACKUP_FILE
aws s3 cp $BACKUP_FILE s3://your-backup-bucket/
rm $BACKUP_FILE

# Run daily via cron
# 0 2 * * * /path/to/backup.sh
```

### 17. Development Best Practices

#### 17.1 Code Quality

```typescript
// ESLint configuration
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}

// Prettier configuration
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

#### 17.2 Git Workflow

```bash
# Feature branch workflow
git checkout -b feature/invoice-templates
# Make changes...
git add .
git commit -m "feat: add invoice template selection"
git push origin feature/invoice-templates
# Create pull request

# Commit message format
# type(scope): description
# 
# feat: new feature
# fix: bug fix
# docs: documentation
# style: formatting
# refactor: code restructuring
# test: adding tests
# chore: maintenance
```

This technical implementation guide provides a comprehensive roadmap for building the Invoice Generator MVP with modern best practices, security considerations, and scalability in mind. The architecture is designed to start simple but accommodate future growth and feature additions.