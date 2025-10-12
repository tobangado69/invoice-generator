# InvoiceFlow - Quick Start Guide

**Get started in 5 minutes! / Mulai dalam 5 menit!**

---

## ⚡ Step-by-Step Setup

### 1️⃣ Install Dependencies (1 minute)
```bash
npm install
```

### 2️⃣ Setup Environment (30 seconds)
Create `.env.local` file in root directory:
```env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="your-secret-key-change-this"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3️⃣ Initialize Database (30 seconds)
```bash
# Database already migrated! Just verify:
npm run db:studio
```

### 4️⃣ Start Application (10 seconds)
```bash
npm run dev
```

Open: **http://localhost:3000**

---

## 📱 First Time User Flow

### A. Register Account (1 minute)
1. Go to http://localhost:3000/register
2. Fill in:
   - Name: `Budi Santoso`
   - Email: `budi@example.com`
   - Password: `Password123`
   - Confirm Password: `Password123`
3. Click **"Daftar / Register"**

### B. Login (30 seconds)
1. Go to http://localhost:3000/login
2. Enter email and password
3. Click **"Masuk / Login"**

### C. Setup Company Profile (2 minutes)
1. Click **"Profil / Profile"** in navigation
2. Fill in:
   - **Nama Perusahaan:** `PT. Contoh Digital`
   - **Bentuk Usaha:** Select `PT (Perseroan Terbatas)`
   - **Email:** `billing@contoh.com`
   - **Phone:** `+62 21 1234 5678`
   - **Address:** `Jl. Sudirman No. 123, Jakarta Selatan 12190`
   - **NPWP:** Type `123456789012345` → Auto-formats to `12.345.678.9-012.345`
   - **PKP Toggle:** Turn ON (if you're registered taxpayer)
   - **Bank Name:** `Bank BCA`
   - **Account Number:** `1234567890`
   - **Account Holder:** `PT. Contoh Digital`
3. Click **"Simpan Profil / Save Profile"**

### D. Create First Invoice (2 minutes)
1. Click **"Buat Baru / New"** button
2. Fill in:
   - **Invoice Number:** Auto-generated `INV/2025/10/001` (editable)
   - **Client Name:** `PT. Klien Utama`
   - **Client Email:** `klien@example.com`
   - **Client Address:** `Jl. Gatot Subroto No. 456, Jakarta`
   - **Client NPWP:** `98.765.432.1-098.765` (optional)

3. Add Items:
   - **Item 1:**
     - Description: `Jasa desain website profesional`
     - Quantity: `1`
     - Rate: `5000000` (5 million)
   - Click **"Tambah Item"** for more items

4. Configure PPN:
   - Toggle **"Gunakan PPN / Use VAT"** to ON
   - Rate auto-set to `11%`
   - See calculation: Rp 5.000.000 + Rp 550.000 = Rp 5.550.000

5. Add Payment Details:
   - **Payment Terms:** Select `Pembayaran dalam 30 hari`
   - **Notes:** `Terima kasih atas kepercayaan Anda`

6. Review Totals:
   - Subtotal: **Rp 5.000.000**
   - PPN (11%): **Rp 550.000**
   - Total: **Rp 5.550.000**
   - Terbilang: **"Lima Juta Lima Ratus Lima Puluh Ribu Rupiah"**

7. Click **"Buat & Kirim / Create & Send"**

### E. Download PDF (30 seconds)
1. Invoice detail page opens automatically
2. Click **"Unduh PDF / Download PDF"**
3. PDF downloads: `invoice-INV-2025-10-001.pdf`
4. Open PDF to see professional Indonesian invoice with:
   - Your company NPWP
   - Client NPWP
   - PPN breakdown
   - Terbilang
   - Bank payment instructions

---

## 🎯 What You Can Do Now

✅ **Create unlimited invoices** with automatic calculations  
✅ **Download professional PDFs** with Indonesian tax compliance  
✅ **Track invoice status** (draft, sent, paid, overdue)  
✅ **Search and filter** invoices easily  
✅ **Automatic PPN calculation** (11% VAT)  
✅ **Terbilang conversion** (amount in Indonesian words)  
✅ **NPWP validation** for tax compliance  
✅ **Bank details** on every invoice for easy payment  

---

## 💡 Pro Tips

### Keyboard Shortcuts
- Press `Tab` to navigate between form fields quickly
- Use `Enter` to submit forms

### Invoice Numbering
- Format: `INV/YEAR/MONTH/SEQUENCE`
- Auto-increments: INV/2025/10/001 → INV/2025/10/002
- Resets monthly: INV/2025/11/001

### NPWP Formatting
- Just type 15 digits: `123456789012345`
- Auto-formats on complete: `12.345.678.9-012.345`
- Validates automatically

### PPN Configuration
- Set default rate in Profile (11%)
- Toggle on/off per invoice
- Rate is editable per invoice if needed

### Search Tips
- Search by invoice number: `INV/2025/10`
- Search by client name: `Klien`
- Search by email: `klien@example`

---

## 🔍 Explore Features

### Dashboard
- View total invoices count
- See pending payments (IDR)
- Track paid amount (IDR)
- **NEW:** Monitor PPN collected
- Quick access to recent invoices

### Invoice List
- Filter by status (draft/sent/paid/overdue)
- Search across all invoice data
- Sort by date (newest first)
- Quick view buttons

### Invoice Actions
- **Mark Sent** - Update status to sent
- **Mark Paid** - Mark as paid
- **Download PDF** - Get printable invoice
- **Delete** - Remove invoice (with confirmation)

---

## 🆘 Need Help?

### Common Issues

**Can't see my company name on dashboard?**
→ Complete your profile first at /profile

**PDF download says "Company not found"?**
→ You must complete company profile before generating PDFs

**NPWP validation fails?**
→ Format must be exactly: XX.XXX.XXX.X-XXX.XXX (15 digits with dots and dash)

**PPN not calculating?**
→ Make sure "Gunakan PPN / Use VAT" toggle is ON

**Invoice not appearing in list?**
→ Check status filter - you might be filtering out your invoice

### Get Support
- Check README.md for detailed documentation
- Review `docs/` folder for technical details
- Inspect database: `npm run db:studio`

---

## 🎓 Next Steps

1. **Test thoroughly** - Create multiple invoices to test
2. **Explore PDF** - Download and review PDF output
3. **Customize** - Update company profile, try different payment terms
4. **Share feedback** - Note any issues or desired features

---

## 🔥 Cool Features to Try

### Auto-Calculations
- Change quantity → Amount updates in IDR
- Change rate → Amount updates instantly
- Toggle PPN → Total recalculates with terbilang

### Indonesian Formatting
- Type any number → See it formatted as Rp X.XXX.XXX
- Type NPWP → Watch it auto-format
- See terbilang → Numbers in Indonesian words

### Professional PDF
- Complete invoice with your branding
- Bank details for easy payment
- Tax compliance (NPWP, PPN)
- Ready to send to clients

---

**🚀 You're all set! Start creating professional invoices!**

**Questions?** Check README.md for comprehensive documentation.

