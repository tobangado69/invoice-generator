# InvoiceFlow - Invoice Generator untuk UMKM Indonesia

**Professional invoice generation with Indonesian tax compliance (PPN, NPWP, terbilang)**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🇮🇩 Fitur Utama / Key Features

### Indonesian Tax Compliance
- ✅ **PPN (11%)** - Automatic Value Added Tax calculation
- ✅ **NPWP** - Tax ID validation and formatting (XX.XXX.XXX.X-XXX.XXX)
- ✅ **Terbilang** - Amount in Indonesian words (e.g., "Satu Juta Rupiah")
- ✅ **PKP Status** - Registered taxpayer configuration
- ✅ **IDR Formatting** - Proper Indonesian currency display (Rp 1.000.000)

### Business Features
- ✅ Create professional invoices in < 2 minutes
- ✅ Business entity support (Perorangan, CV, PT, UD, Firma)
- ✅ Auto-generated invoice numbers (INV/2025/10/001)
- ✅ Indonesian payment terms presets
- ✅ Bank account details for payment instructions
- ✅ PDF generation with Indonesian formatting
- ✅ Invoice management (draft, sent, paid, overdue)

### Technical Features
- ✅ Indonesian-first UI (Bahasa Indonesia)
- ✅ Mobile-responsive design
- ✅ Secure authentication with NextAuth v5
- ✅ SQLite database (upgradeable to PostgreSQL)
- ✅ Real-time calculations
- ✅ Type-safe with TypeScript

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git (optional)

### Installation

1. **Clone or download the project:**
   ```bash
   cd "Invoice Generator"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   Create `.env.local` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-change-this"
   AUTH_URL="http://localhost:3000"
   AUTH_TRUST_HOST="true"
   ```

4. **Initialize database:**
   ```bash
   npm run db:migrate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open application:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Usage Guide

### First Time Setup

1. **Register Account**
   - Go to http://localhost:3000/register
   - Enter your email and password
   - Click "Daftar / Register"

2. **Login**
   - Go to http://localhost:3000/login
   - Enter credentials
   - Click "Masuk / Login"

3. **Complete Company Profile**
   - Navigate to "Profil / Profile"
   - Fill in:
     - Company name (required)
     - Business entity (Perorangan, CV, PT, UD, Firma)
     - NPWP (format: XX.XXX.XXX.X-XXX.XXX)
     - PKP status
     - Bank account details
     - Default PPN rate (11%)
   - Click "Simpan Profil / Save Profile"

### Creating Your First Invoice

1. **Click "Buat Baru / New"** or go to "Create Invoice"

2. **Fill Invoice Details:**
   - Invoice number (auto-generated, editable)
   - Issue date and due date
   - Client information (name, email, address)
   - Client NPWP (optional)

3. **Add Line Items:**
   - Description (e.g., "Jasa desain website")
   - Quantity
   - Rate (price per unit)
   - Amount auto-calculated in IDR

4. **Configure PPN:**
   - Toggle "Gunakan PPN / Use VAT"
   - Adjust rate if needed (default 11%)
   - See real-time calculation

5. **Add Payment Details:**
   - Select payment terms from presets
   - Add custom notes

6. **Review Totals:**
   - See subtotal, PPN, and total in IDR
   - View "Terbilang" (amount in Indonesian words)

7. **Save:**
   - "Simpan Draft / Save Draft" - Save without sending
   - "Buat & Kirim / Create & Send" - Save and mark as sent

### Managing Invoices

1. **View All Invoices:**
   - Go to "Invoice" menu
   - Use search to find specific invoices
   - Filter by status (draft, sent, paid, overdue)

2. **View Invoice Details:**
   - Click "Lihat / View" on any invoice
   - See complete invoice preview

3. **Download PDF:**
   - Click "Unduh PDF / Download PDF"
   - PDF includes all Indonesian tax formatting

4. **Update Status:**
   - "Tandai Terkirim / Mark Sent"
   - "Tandai Dibayar / Mark Paid"

5. **Delete Invoice:**
   - Click "Hapus / Delete" button
   - Confirm deletion

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database Management
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma Client
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:push      # Push schema changes without migration
npm run db:reset     # Reset database (CAUTION: deletes all data)
```

---

## 📁 Project Structure

```
Invoice Generator/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── company/        # Company profile API
│   │   └── invoices/       # Invoice CRUD + PDF
│   ├── dashboard/          # Dashboard page
│   ├── invoices/           # Invoice pages
│   ├── profile/            # Company profile page
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Base UI components (shadcn/ui)
│   ├── invoice-form.tsx    # Invoice creation form
│   ├── invoice-table.tsx   # Invoice list table
│   ├── invoice-preview.tsx # Invoice display & actions
│   └── site-header.tsx     # Navigation header
├── hooks/
│   ├── use-auth.ts         # Authentication hook
│   ├── use-company.ts      # Company profile hooks
│   └── use-invoices.ts     # Invoice CRUD hooks
├── lib/
│   ├── indonesian-utils.ts # Indonesian utilities (terbilang, PPN, NPWP)
│   ├── validations.ts      # Zod validation schemas
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # NextAuth v5 config
│   ├── auth-client.ts      # Auth client utilities
│   └── pdf/
│       └── invoice-template.tsx # PDF template (pdf-lib)
├── types/
│   └── invoice.ts          # TypeScript types
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
└── .env.local              # Environment variables (create this)
```

---

## 🔧 Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Validation

### Backend
- **Next.js API Routes** - Backend API
- **Prisma** - ORM
- **SQLite** - Database (production: PostgreSQL)
- **NextAuth v5** - Authentication
- **pdf-lib** - PDF generation

### Indonesian Utilities
- **formatIDR()** - Currency formatting
- **terbilang()** - Number to words conversion
- **NPWP validation** - Tax ID validation
- **PPN calculation** - 11% VAT calculation

---

## 🧪 Testing the Application

### Manual Testing Checklist

**Authentication:**
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Protected routes redirect to login
- [ ] Can logout successfully

**Company Profile:**
- [ ] Can save company information
- [ ] NPWP validation works (XX.XXX.XXX.X-XXX.XXX)
- [ ] Business entity dropdown works
- [ ] PKP toggle works
- [ ] Bank details save correctly

**Invoice Creation:**
- [ ] Can add/remove line items
- [ ] Amounts auto-calculate in IDR
- [ ] PPN toggle works
- [ ] PPN calculation accurate (11%)
- [ ] Terbilang displays correctly
- [ ] Can save as draft
- [ ] Can create and send

**Invoice Management:**
- [ ] Dashboard shows correct stats in IDR
- [ ] Invoice table displays all invoices
- [ ] Search works across invoice data
- [ ] Status filter works
- [ ] Can view individual invoice
- [ ] Can update invoice status
- [ ] Can delete invoice

**PDF Generation:**
- [ ] PDF downloads successfully
- [ ] PDF shows all invoice details
- [ ] PDF includes NPWP, PPN, terbilang
- [ ] PDF includes bank details
- [ ] PDF formatting is professional

---

## 🎯 Indonesian Market Features

### NPWP (Nomor Pokok Wajib Pajak)
- Auto-formatting from 15 digits to XX.XXX.XXX.X-XXX.XXX
- Real-time validation
- Displayed on invoices and PDF

### PPN (Pajak Pertambahan Nilai)
- Default rate: 11% (configurable)
- Toggle on/off per invoice
- Separate display: Subtotal + PPN = Total
- PKP compliance ready

### Terbilang
- Automatic conversion to Indonesian words
- Example: 1.500.000 → "Satu Juta Lima Ratus Ribu Rupiah"
- Displayed on invoice preview and PDF

### Invoice Number Format
- Pattern: INV/YYYY/MM/XXX
- Auto-increments per month
- Examples: INV/2025/10/001, INV/2025/10/002

### Business Entity Types
- Perorangan (Individual/Freelancer)
- CV (Commanditaire Vennootschap)
- PT (Perseroan Terbatas)
- UD (Usaha Dagang)
- Firma (Partnership)

### Payment Terms (Indonesian)
- Pembayaran dalam 7/14/30 hari
- Transfer sebelum barang dikirim
- 50% DP, 50% pelunasan
- Custom terms supported

---

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ Session-based authentication (7-day expiry)
- ✅ Protected API routes
- ✅ User data isolation
- ✅ Input validation and sanitization
- ✅ HTTPS ready (for production)

---

## 📊 Database Schema

### Tables
- **users** - Authentication
- **companies** - Business profiles with NPWP, PKP, bank details
- **invoices** - Invoices with PPN, terbilang, Indonesian formatting
- **invoice_items** - Line items for each invoice

### Key Fields
```sql
companies:
  - npwp VARCHAR(20)           -- XX.XXX.XXX.X-XXX.XXX
  - is_pkp BOOLEAN             -- PKP status
  - business_entity VARCHAR    -- Perorangan, CV, PT, etc.
  - default_ppn_rate FLOAT     -- Default 11%
  - bank_name, bank_account_number, bank_account_holder

invoices:
  - invoice_number VARCHAR     -- INV/2025/10/001
  - client_npwp VARCHAR        -- Client's NPWP (optional)
  - ppn_rate FLOAT             -- PPN percentage
  - ppn_amount FLOAT           -- Calculated PPN
  - amount_in_words TEXT       -- Terbilang
  - currency VARCHAR           -- Default "IDR"
  - payment_terms TEXT         -- Indonesian payment terms
```

---

## 🐛 Troubleshooting

### Database Issues

**Error: "Environment variable DATABASE_URL not found"**
```bash
# Create .env.local file with:
DATABASE_URL="file:./dev.db"
```

**Error: "Prisma Client not generated"**
```bash
npm run db:generate
```

**Database is corrupted**
```bash
npm run db:reset  # WARNING: This deletes all data
```

### Authentication Issues

**Can't login after registration**
- Check that NEXTAUTH_SECRET is set in .env.local
- Check that AUTH_URL matches your localhost
- Try clearing browser cookies

**Session expires too quickly**
- Session duration: 7 days (configured in lib/auth.ts)
- JWT strategy for stateless sessions

### PDF Generation Issues

**PDF download fails**
- Ensure company profile is complete
- Check console for errors
- Verify pdf-lib is installed
- Check if all invoice fields are filled

**PDF shows "Company data not found"**
- Complete your profile first at /profile
- Company name is required

---

## 🚀 Deployment

### Production Checklist

1. **Environment Variables:**
   ```env
   DATABASE_URL="your-production-database-url"
   NEXTAUTH_SECRET="use-strong-secret-key-min-32-chars"
   AUTH_URL="https://yourdomain.com"
   AUTH_TRUST_HOST="true"
   ```

2. **Database:**
   - For production, consider PostgreSQL instead of SQLite
   - Update Prisma schema datasource to "postgresql"
   - Run migrations on production database

3. **Security:**
   - Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
   - Enable HTTPS
   - Set AUTH_TRUST_HOST=true for production
   - Review CORS settings if needed

4. **Deployment Platforms:**
   - **Vercel** (Recommended) - Deploy with one click
   - **Railway** - With PostgreSQL database
   - **Render** - Free tier available

---

## 📝 Development Notes

### Key Files

**Indonesian Utilities** (`lib/indonesian-utils.ts`):
- formatIDR, terbilang, NPWP validation
- PPN calculation, invoice number generation

**Validation Schemas** (`lib/validations.ts`):
- Zod schemas with bilingual error messages
- NPWP regex validation

**API Routes** (`app/api/`):
- `/api/auth/[...nextauth]` - NextAuth v5 handlers
- `/api/auth/register` - User registration
- `/api/company` - Company profile CRUD
- `/api/invoices` - Invoice CRUD
- `/api/invoices/[id]/pdf` - PDF generation
- `/api/invoices/[id]/download-pdf` - PDF download

**React Query Hooks** (`hooks/`):
- `useAuth()` - Authentication state
- `useCompany()` - Company profile
- `useInvoices()` - Invoice list
- `useCreateInvoice()`, `useUpdateInvoice()`, `useDeleteInvoice()`

---

## 🎨 Customization

### Change Default PPN Rate
Edit `lib/indonesian-utils.ts`:
```typescript
export function calculatePPN(subtotal: number, rate: number = 11)
```

### Add Custom Payment Terms
Edit `lib/indonesian-utils.ts`:
```typescript
export const PAYMENT_TERMS_PRESETS = [
  'Your custom term',
  // ... existing terms
]
```

### Modify PDF Template
Edit `lib/pdf/invoice-template.tsx` to customize:
- Colors, fonts, layout
- Add company logo (upload feature)
- Additional fields
- Uses pdf-lib for PDF generation

---

## 📚 Additional Resources

- **PRD:** See `docs/PRD.md` for product requirements
- **Indonesian Features:** See `docs/indonesian-market-features.md`
- **Technical Guide:** See `docs/technical-implementation-guide.md`
- **Prisma Docs:** https://www.prisma.io/docs
- **NextAuth v5 Docs:** https://authjs.dev
- **Next.js 15 Docs:** https://nextjs.org/docs

---

## 🤝 Contributing

This is an MVP (Minimum Viable Product). Future enhancements:
- E-Faktur integration
- Payment gateway (Midtrans, Xendit)
- Recurring invoices
- Client database
- WhatsApp integration
- Multi-currency support

---

## 📄 License

MIT License - Feel free to use for your business

---

## 🙏 Support

For questions or issues:
- Check `docs/` folder for detailed documentation
- Review code comments for implementation details
- Open an issue on GitHub (if applicable)

---

**Built with ❤️ for Indonesian UMKM, freelancers, and professionals**

*InvoiceFlow - Buat invoice profesional dalam 2 menit*

