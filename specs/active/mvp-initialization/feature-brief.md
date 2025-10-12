# Feature Brief: InvoiceFlow MVP Initialization

**Task ID:** `mvp-initialization`  
**Created:** October 11, 2025  
**Updated:** October 11, 2025 (Landing Page + i18n Evolution)  
**Status:** 🟢 Implementation Complete + Enhancements  
**Estimated Effort:** 5-7 days (full MVP foundation) + 2-3 hours (enhancements)  

---

## 🎯 Problem & User Context

### Problem Statement
Indonesian freelancers, UMKM owners, and consultants struggle with:
- **Manual invoicing** using Excel/Word (time-consuming, error-prone)
- **Tax compliance** - PPN (11%) calculations and NPWP formatting requirements
- **Expensive alternatives** - Existing solutions cost 200k-500k IDR/month
- **No Indonesian localization** - Currency, language, tax formats not supported
- **Poor mobile experience** - 85% of Indonesian users are mobile-first

### Target Users
1. **Budi (Freelance Designer)** - Creates 5-10 invoices/month, needs professional output fast
2. **Siti (Business Consultant)** - Requires NPWP/PPN compliance for B2B clients
3. **Andi (Agency Owner)** - Manages recurring clients, needs consistent branding

### Success Criteria
✅ User can create first invoice in < 5 minutes  
✅ Automatic PPN (11%) calculation with zero errors  
✅ NPWP validation accuracy > 98%  
✅ PDF generation < 5 seconds  
✅ Mobile-responsive (works on 3G/4G Indonesian networks)  
✅ Bilingual UI (Bahasa Indonesia + English)  

---

## 🔍 Quick Research (15-min patterns)

### Existing Tech Stack Analysis
**Current State:** Basic Next.js setup with some UI components already in place

**Verified Existing:**
- ✅ Next.js project structure
- ✅ Tailwind CSS configured
- ✅ UI components (shadcn/ui based)
- ✅ TypeScript setup
- ✅ Basic app structure with pages

**Missing Critical Infrastructure:**
- ❌ Database (PostgreSQL + Prisma)
- ❌ Authentication (Better Auth)
- ❌ Indonesian utilities (formatIDR, terbilang, NPWP validation)
- ❌ PDF generation (@react-pdf/renderer)
- ❌ State management (TanStack Query)
- ❌ Form validation (Zod schemas)
- ❌ i18n (internationalization)

### Similar Implementations
**Pattern:** Most successful Indonesian fintech/SaaS apps use:
- Next.js App Router for SEO + performance
- Edge deployment (Vercel Singapore) for low latency
- Aggressive caching for mobile networks
- Progressive Web App (PWA) for offline capability

---

## 📋 Essential Requirements

### Phase 1: Foundation (Days 1-2)
**Infrastructure Setup:**
1. **Database Layer**
   - PostgreSQL setup (local + production)
   - Prisma ORM configuration
   - Schema migration: users, companies, invoices, invoice_items
   - Seed data for testing

2. **Authentication System**
   - Better Auth v1 integration
   - Email/password authentication
   - Session management
   - Protected route middleware

3. **Core Utilities**
   - Indonesian helpers: `formatIDR()`, `formatNPWP()`, `terbilang()`
   - Validation schemas: `invoiceSchema`, `companySchema`
   - Date/timezone utilities (Asia/Jakarta)

### Phase 2: Core Features (Days 3-5)
**Invoice Management:**
1. **Company Profile Setup**
   - Form with NPWP validation
   - Business entity selection (Perorangan, CV, PT, UD, Firma)
   - PKP status toggle
   - Bank account details
   - Default PPN rate (11%)

2. **Invoice Creation**
   - Dynamic line item management
   - Real-time PPN calculation
   - Auto-generated invoice numbers (INV/2025/10/001)
   - Client NPWP validation (optional)
   - Payment terms (Indonesian presets)
   - Terbilang display

3. **Invoice List & Management**
   - Dashboard with statistics
   - Filter by status (draft, sent, paid, overdue)
   - Search functionality
   - Edit/delete capabilities

### Phase 3: PDF & Polish (Days 6-7)
1. **PDF Generation**
   - Professional Indonesian invoice template
   - Company branding integration
   - PPN breakdown display
   - Payment instructions (bank details)
   - Terbilang in PDF

2. **UX Optimization**
   - Mobile-first responsive design
   - Loading states & error handling
   - Bilingual toggle (ID/EN)
   - Toast notifications
   - Keyboard shortcuts

---

## 🛠️ Implementation Approach

### Tech Stack (Confirmed)
```typescript
Frontend:
- Next.js 14+ (App Router) ✓
- React 18 + TypeScript ✓
- TailwindCSS ✓
- shadcn/ui components ✓
- React Hook Form + Zod
- TanStack Query v5

Backend:
- Next.js API Routes
- Better Auth v1
- Prisma ORM
- PostgreSQL 15+

PDF:
- @react-pdf/renderer

State:
- TanStack Query (server state)
- Zustand (UI state)
```

### Architecture Decisions

**1. Database Design**
```prisma
model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  passwordHash  String
  emailVerified Boolean   @default(false)
  company       Company?
  invoices      Invoice[]
}

model Company {
  id                Int      @id @default(autoincrement())
  userId            Int      @unique
  name              String
  businessEntity    String?  // Perorangan, CV, PT, UD, Firma
  npwp              String?  // XX.XXX.XXX.X-XXX.XXX
  isPkp             Boolean  @default(false)
  bankName          String?
  bankAccountNumber String?
  defaultPpnRate    Decimal  @default(11.00) @db.Decimal(5, 2)
  user              User     @relation(fields: [userId], references: [id])
}

model Invoice {
  id             Int           @id @default(autoincrement())
  userId         Int
  invoiceNumber  String        @unique
  clientName     String
  clientNpwp     String?
  issueDate      DateTime
  dueDate        DateTime
  subtotal       Decimal       @db.Decimal(15, 2)
  ppnRate        Decimal       @default(0) @db.Decimal(5, 2)
  ppnAmount      Decimal       @default(0) @db.Decimal(15, 2)
  totalAmount    Decimal       @db.Decimal(15, 2)
  amountInWords  String?       // Terbilang
  currency       String        @default("IDR")
  status         String        @default("draft")
  items          InvoiceItem[]
  user           User          @relation(fields: [userId], references: [id])
}

model InvoiceItem {
  id          Int     @id @default(autoincrement())
  invoiceId   Int
  description String
  quantity    Decimal @default(1) @db.Decimal(10, 2)
  rate        Decimal @db.Decimal(10, 2)
  amount      Decimal @db.Decimal(10, 2)
  invoice     Invoice @relation(fields: [invoiceId], references: [id])
}
```

**2. Indonesian Utilities (Critical)**
```typescript
// lib/indonesian-utils.ts

// Currency: 1000000 → "Rp 1.000.000"
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// NPWP: 123456789012345 → "12.345.678.9-012.345"
export function formatNPWP(npwp: string): string {
  const cleaned = npwp.replace(/\D/g, '');
  if (cleaned.length !== 15) return npwp;
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}.${cleaned.slice(8, 9)}-${cleaned.slice(9, 12)}.${cleaned.slice(12, 15)}`;
}

// Validation
export function validateNPWP(npwp: string): boolean {
  return /^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/.test(npwp);
}

// Terbilang: 1500000 → "Satu Juta Lima Ratus Ribu Rupiah"
export function terbilang(angka: number): string {
  const huruf = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 
                 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 
                 'Sepuluh', 'Sebelas'];
  
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
  
  return angka.toString() + ' Rupiah';
}

// PPN Calculation
export function calculatePPN(subtotal: number, rate: number = 11): number {
  return subtotal * (rate / 100);
}

// Invoice Number Generator: INV/2025/10/001
export function generateInvoiceNumber(count: number): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const sequence = String(count + 1).padStart(3, '0');
  return `INV/${year}/${month}/${sequence}`;
}
```

**3. Form Validation (Zod)**
```typescript
// lib/validations.ts
import { z } from 'zod';

const npwpRegex = /^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/;

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  quantity: z.number().min(0.01, 'Kuantitas harus lebih dari 0'),
  rate: z.number().min(0.01, 'Harga satuan harus lebih dari 0'),
  amount: z.number().min(0.01),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Nomor invoice wajib diisi'),
  clientName: z.string().min(1, 'Nama klien wajib diisi'),
  clientEmail: z.string().email('Email tidak valid').optional(),
  clientNpwp: z.string().regex(npwpRegex, 'Format NPWP tidak valid').optional(),
  issueDate: z.date(),
  dueDate: z.date(),
  items: z.array(invoiceItemSchema).min(1, 'Minimal satu item diperlukan'),
  ppnRate: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  paymentTerms: z.string().optional(),
}).refine(data => data.dueDate >= data.issueDate, {
  message: "Tanggal jatuh tempo harus setelah tanggal terbit",
  path: ["dueDate"],
});

export const companySchema = z.object({
  name: z.string().min(1, 'Nama perusahaan wajib diisi'),
  businessEntity: z.enum(['Perorangan', 'CV', 'PT', 'UD', 'Firma']).optional(),
  npwp: z.string().regex(npwpRegex, 'Format NPWP tidak valid').optional(),
  isPkp: z.boolean().default(false),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  defaultPpnRate: z.number().min(0).max(100).default(11),
});
```

**4. API Structure**
```
/api/auth/*              - Better Auth endpoints
/api/company             - GET/PUT company profile
/api/invoices            - GET (list), POST (create)
/api/invoices/[id]       - GET, PUT, DELETE
/api/invoices/[id]/pdf   - GET PDF generation
```

**5. Component Architecture**
```
components/
├── ui/                  # Base components (shadcn/ui)
├── forms/
│   ├── invoice-form.tsx       # Main invoice creation form
│   ├── company-form.tsx       # Company profile setup
│   └── invoice-item-row.tsx   # Dynamic line item
├── invoice/
│   ├── invoice-preview.tsx    # Live preview
│   ├── invoice-table.tsx      # List view
│   └── pdf-template.tsx       # PDF layout
├── dashboard/
│   ├── stat-cards.tsx         # Dashboard metrics
│   └── recent-invoices.tsx    # Quick access list
└── layout/
    ├── site-header.tsx        # Main navigation
    └── locale-switcher.tsx    # ID/EN toggle
```

---

## 🚀 Immediate Next Actions

### Day 1: Database & Auth Foundation
- [ ] Install dependencies: `prisma`, `@prisma/client`, `better-auth`, `@tanstack/react-query`
- [ ] Create `prisma/schema.prisma` with full schema
- [ ] Setup PostgreSQL (local: Docker/Railway)
- [ ] Run migrations: `npx prisma migrate dev --name init`
- [ ] Configure Better Auth in `lib/auth.ts`
- [ ] Create auth middleware for route protection
- [ ] Setup TanStack Query provider

### Day 2: Core Utilities & Validation
- [ ] Create `lib/indonesian-utils.ts` with all helper functions
- [ ] Create `lib/validations.ts` with Zod schemas
- [ ] Write unit tests for Indonesian utilities
- [ ] Create `lib/api-client.ts` for type-safe API calls
- [ ] Setup error handling utilities

### Day 3: Authentication Flow
- [ ] Build `/app/(auth)/login/page.tsx`
- [ ] Build `/app/(auth)/register/page.tsx`
- [ ] Implement email verification flow
- [ ] Create protected layout wrapper
- [ ] Add session persistence

### Day 4: Company Profile
- [ ] Build `/app/profile/page.tsx`
- [ ] Create `CompanyForm` with NPWP validation
- [ ] API route: `POST/PUT /api/company`
- [ ] Implement file upload for logo
- [ ] Save default settings (PPN rate, bank details)

### Day 5: Invoice Creation
- [ ] Build `/app/invoices/new/page.tsx`
- [ ] Create `InvoiceForm` with dynamic items
- [ ] Real-time calculations (PPN, totals)
- [ ] Auto-generate invoice numbers
- [ ] API route: `POST /api/invoices`
- [ ] Preview modal with terbilang display

### Day 6: Invoice Management
- [ ] Build `/app/invoices/page.tsx` (list view)
- [ ] Create `InvoiceTable` component
- [ ] Implement filters (status, date range)
- [ ] Search functionality
- [ ] API routes: `GET /api/invoices`, `GET/PUT/DELETE /api/invoices/[id]`
- [ ] Dashboard stats calculation

### Day 7: PDF Generation & Polish
- [ ] Install `@react-pdf/renderer`
- [ ] Create Indonesian invoice PDF template
- [ ] API route: `GET /api/invoices/[id]/pdf`
- [ ] Download functionality
- [ ] Mobile responsive testing
- [ ] Add bilingual support (i18n setup)
- [ ] Loading states & error boundaries
- [ ] Toast notifications

---

## 📦 Dependencies to Install

```bash
# Core dependencies
npm install @prisma/client prisma better-auth bcryptjs
npm install @tanstack/react-query zustand
npm install react-hook-form @hookform/resolvers zod
npm install @react-pdf/renderer
npm install date-fns

# Dev dependencies
npm install -D @types/bcryptjs
npm install -D prisma

# Optional (if not already present)
npm install lucide-react class-variance-authority clsx
```

---

## 🔄 Living Document Updates

### Implementation Log
- **Oct 11, 2025:** Initial brief created
- _Updates will be added as development progresses_

### Deviations from Plan
- _To be documented during implementation_

### Lessons Learned
- _Key insights to be captured_

---

## 📊 Success Metrics (MVP Launch)

**Performance:**
- [ ] Page load < 3s on 3G
- [ ] PDF generation < 5s
- [ ] Invoice creation < 2 minutes

**Functionality:**
- [ ] NPWP validation 98% accuracy
- [ ] Zero PPN calculation errors
- [ ] All CRUD operations working

**UX:**
- [ ] Mobile responsive on iOS/Android
- [ ] Bilingual toggle works seamlessly
- [ ] Forms have proper validation feedback

---

## 🎯 Out of Scope (Future Versions)

- ❌ Client database management
- ❌ Payment gateway integration (Midtrans, Xendit)
- ❌ E-Faktur DJP integration
- ❌ Recurring invoices
- ❌ WhatsApp sharing
- ❌ Multi-currency support
- ❌ Team collaboration

---

## 📞 Reference Links

- **PRD:** `docs/PRD.md`
- **Indonesian Features:** `docs/indonesian-market-features.md`
- **Technical Guide:** `docs/technical-implementation-guide.md`

---

## 🔄 Evolution Changelog

### Version 1.1 - October 11, 2025: Landing Page + i18n System

**Discovery:** Core MVP implementation complete (100%). User feedback: Direct login → dashboard feels abrupt. Need better onboarding and proper language separation.

**New Requirements:**

#### 1. Landing Page (Public Homepage)
**Problem:** Users land directly on dashboard (auth-walled). No public page to explain what InvoiceFlow does.

**Solution:**
- Create marketing landing page at `/` (public)
- Move dashboard to `/dashboard` (protected)
- Landing page features:
  - Hero section with value proposition
  - Feature highlights (PPN, NPWP, terbilang, PDF)
  - How it works (3-step process)
  - Pricing preview
  - CTA buttons (Register, Login)
  - Language switcher
  - Mobile-optimized

#### 2. Proper Internationalization (i18n)
**Problem:** Current "inline bilingual" (Label: "Nama / Name") works but isn't scalable. Hard to maintain, no language persistence.

**Solution:** Context-based i18n system
- Create `contexts/language-context.tsx`
- Language state with localStorage persistence
- Translation object with complete ID/EN
- Language switcher in header
- Clean component labels (no inline bilingual)

**Benefits:**
- Cleaner code (no "Label / Label" everywhere)
- Easy to add more languages later
- User language preference persists
- Professional UX (not mixed language)

**Implementation Approach:**
```typescript
// contexts/language-context.tsx
type Language = 'id' | 'en'
const translations = {
  id: { /* Indonesian */ },
  en: { /* English */ }
}

// Usage in components:
const { t } = useLanguage()
<Label>{t('company.name')}</Label>  // Clean!
```

**Scope:**
- Landing page (new)
- Language context provider (new)
- Translation system (new)
- Language switcher component (new)
- Update all existing components to use `t()` function
- Persist language choice in localStorage

**Estimated Effort:** 2-3 hours

---

**Ready to Start:** This brief provides the foundation to begin coding immediately. Follow the 7-day plan, update this document as you progress, and document any deviations or learnings.

