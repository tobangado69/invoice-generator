# Indonesian Market Features - InvoiceFlow
## Fitur Khusus untuk Pasar Indonesia

**Last Updated:** October 11, 2025  
**Version:** MVP 1.0

---

## 📋 Executive Summary

InvoiceFlow MVP dirancang khusus untuk pasar Indonesia dengan fokus pada kebutuhan UMKM, freelancer, dan profesional digital Indonesia. Platform ini menyediakan solusi invoicing yang sesuai dengan regulasi perpajakan Indonesia dan praktik bisnis lokal.

## 🇮🇩 Fitur Khusus Indonesia

### 1. Kepatuhan Pajak & Regulasi

#### NPWP (Nomor Pokok Wajib Pajak)
- **Format Validation**: XX.XXX.XXX.X-XXX.XXX
- **Auto-formatting**: Input 15 digit otomatis diformat
- **Company NPWP**: Untuk profil perusahaan
- **Client NPWP**: Optional untuk invoice B2B
- **Validation**: Real-time format checking

#### PPN (Pajak Pertambahan Nilai)
- **Rate**: 11% (sesuai peraturan terbaru)
- **Toggle**: On/off untuk setiap invoice
- **Auto-calculation**: Subtotal × 11% = PPN Amount
- **Display**: Terpisah dari subtotal (Subtotal + PPN = Total)
- **PKP Compliance**: Format khusus untuk Pengusaha Kena Pajak

#### PKP (Pengusaha Kena Pajak) Status
- **Company Setting**: Mark perusahaan sebagai PKP
- **Invoice Format**: Format faktur sesuai ketentuan DJP
- **Future Integration**: E-Faktur preparation (v1.2)

### 2. Format Mata Uang Indonesia

#### IDR (Indonesian Rupiah) Formatting
- **Display Format**: Rp 1.000.000 (titik sebagai thousand separator)
- **Decimal**: Optional (umumnya tidak digunakan untuk IDR)
- **Example**: 
  - Rp 500.000
  - Rp 1.250.000
  - Rp 10.000.000

#### Database Storage
- **Precision**: DECIMAL(15,2) untuk nilai besar
- **Currency Field**: Default 'IDR'
- **Future Support**: Multi-currency (USD, SGD, MYR) di v2.0

### 3. Terbilang (Amount in Words)

**Function**: Convert angka ke kata-kata Indonesia
**Example**:
- 1.500.000 → "Satu Juta Lima Ratus Ribu Rupiah"
- 2.750.000 → "Dua Juta Tujuh Ratus Lima Puluh Ribu Rupiah"

**Display**: Muncul di PDF invoice untuk validasi jumlah total

### 4. Bentuk Badan Usaha Indonesia

Pilihan entity bisnis sesuai regulasi Indonesia:
- **Perorangan** - Individual/Freelancer (non-badan hukum)
- **CV** - Commanditaire Vennootschap (persekutuan komanditer)
- **PT** - Perseroan Terbatas (limited liability company)
- **UD** - Usaha Dagang (sole proprietorship)
- **Firma** - Partnership

### 5. Nomor Invoice Format Indonesia

**Format**: INV/YYYY/MM/XXX

**Examples**:
- INV/2025/10/001
- INV/2025/10/002
- INV/2025/11/001

**Features**:
- Auto-increment per bulan
- Editable jika diperlukan
- Unique constraint di database

### 6. Bank Account Details

**Purpose**: Instruksi pembayaran di invoice

**Fields**:
- Bank Name (BCA, Mandiri, BNI, BRI, dll)
- Account Number
- Account Holder Name

**Display**: Muncul di PDF sebagai payment instructions

### 7. Syarat Pembayaran (Payment Terms)

**Indonesian Terms**:
- "Pembayaran dalam 7 hari"
- "Pembayaran dalam 14 hari"
- "Pembayaran dalam 30 hari"
- "Transfer sebelum barang dikirim"
- "50% DP, 50% pelunasan"

**Custom**: User bisa input custom payment terms

## 🎨 User Interface & UX

### Bilingual Support
- **Default**: Bahasa Indonesia
- **Toggle**: Switch ke English
- **UI Elements**: All labels bilingual
- **Error Messages**: Indonesian & English

### Mobile-First Design
**Stats**: 85% pengguna Indonesia akses via mobile

**Optimizations**:
- Touch-friendly buttons (min 44px)
- Simplified forms untuk layar kecil
- Progressive Web App (PWA) capability
- Offline draft saving
- Compressed images & assets

### Network Optimization
**Target**: 3G/4G Indonesian networks

**Strategies**:
- Asset compression & minification
- Lazy loading images
- Code splitting
- CDN dengan edge locations di Indonesia
- Cache-first strategies

## 📱 Target User Behavior

### Primary Use Cases
1. **Freelancer Designer**
   - 5-10 invoice per bulan
   - Klien lokal & internasional
   - Butuh invoice profesional cepat

2. **UMKM Owner**
   - Regular invoicing untuk klien B2B
   - Perlu NPWP & PPN compliance
   - Track pending payments

3. **Konsultan Digital**
   - High-value invoices
   - Professional presentation
   - Tax compliance penting

### Mobile Usage Patterns
- **Create Invoice**: Di perjalanan/meeting
- **Preview**: Sebelum kirim ke klien
- **Download PDF**: Langsung kirim via WhatsApp
- **Track Status**: Check di dashboard mobile

## 🔒 Compliance & Security

### Indonesian Data Protection
- **UU PDP**: Undang-Undang Perlindungan Data Pribadi
- **Data Storage**: Recommended di Indonesia jurisdiction
- **User Rights**: Data export, deletion, portability

### Tax Compliance
- **DJP Format**: Sesuai format Direktorat Jenderal Pajak
- **Record Retention**: 10 tahun (per tax law)
- **PKP Format**: Siap untuk upgrade ke E-Faktur

### Payment Security
**Future Integrations** (v1.2+):
- Midtrans (payment gateway)
- Xendit (payment orchestration)
- OVO, GoPay, DANA (e-wallets)
- QRIS (QR Code payment)

## 📊 Localization Details

### Date & Time
- **Format**: DD/MM/YYYY atau DD-MM-YYYY
- **Timezone**: Asia/Jakarta (WIB)
- **Display**: "11 Oktober 2025"

### Number Formatting
- **Thousand Separator**: Titik (.)
- **Decimal Separator**: Koma (,)
- **Example**: 1.234.567,89

### Address Format
```
Jl. Sudirman No. 123
Kelurahan Senayan
Kecamatan Kebayoran Baru
Jakarta Selatan 12190
DKI Jakarta
```

## 🚀 MVP Feature Checklist

### ✅ Included in MVP 1.0
- [x] Bilingual interface (ID/EN)
- [x] NPWP validation & formatting
- [x] PPN 11% calculation
- [x] IDR currency formatting
- [x] Terbilang conversion
- [x] Indonesian invoice number format
- [x] Business entity selection
- [x] PKP status configuration
- [x] Bank account details
- [x] Mobile-responsive design
- [x] Payment terms in Indonesian

### ❌ Future Versions

#### Version 1.1 (3 months)
- [ ] Multiple invoice templates
- [ ] WhatsApp integration
- [ ] Invoice reminders
- [ ] Client database

#### Version 1.2 (6 months)
- [ ] E-Faktur preparation
- [ ] Payment gateway integration
- [ ] OVO/GoPay/DANA
- [ ] QRIS payment
- [ ] Invoice tracking

#### Version 2.0 (12 months)
- [ ] Full E-Faktur integration with DJP Online
- [ ] Mobile app (Android/iOS)
- [ ] Team collaboration
- [ ] API access
- [ ] Expense tracking

## 💰 Pricing Strategy for Indonesian Market

### Target Pricing
- **Free Tier**: 5 invoices/month (untuk trial)
- **Starter**: Rp 49.000/bulan (unlimited invoices)
- **Business**: Rp 99.000/bulan (+ multiple templates, client DB)
- **Professional**: Rp 199.000/bulan (+ E-Faktur, team features)

### Payment Methods
- Bank Transfer (BCA, Mandiri, BRI, BNI)
- E-wallet (OVO, GoPay, DANA)
- Virtual Account
- QRIS
- Credit Card (via Midtrans/Xendit)

### Pricing Localization
- **Annual Discount**: 20% (2 bulan gratis)
- **UMKM Discount**: Special pricing untuk registered UMKM
- **Referral Bonus**: 1 bulan gratis per referral

## 📈 Success Metrics

### Primary KPIs
- **User Acquisition**: 500 users in 3 months
- **PPN Usage**: 60% invoices include PPN
- **Mobile Usage**: 75% access via mobile
- **NPWP Validation**: 98% accuracy
- **Average Invoices**: 8-10 per active user/month

### Market Penetration
- **Jakarta**: 40% of users
- **Surabaya**: 15% of users
- **Bandung**: 12% of users
- **Other Cities**: 33% of users

### User Segments
- **Freelancers**: 45%
- **UMKM**: 35%
- **Small Agencies**: 15%
- **Consultants**: 5%

## 🎯 Competitive Advantages

### vs. Excel/Word Templates
✅ Professional formatting  
✅ Automatic calculations  
✅ NPWP validation  
✅ Cloud storage & access  
✅ Mobile friendly  

### vs. International Tools (Invoicely, Wave)
✅ Indonesian language  
✅ PPN compliance  
✅ NPWP support  
✅ IDR formatting  
✅ Terbilang feature  
✅ Local payment methods  

### vs. Full Accounting Software (Accurate, Jurnal)
✅ Simpler & faster  
✅ More affordable  
✅ No training required  
✅ Mobile-first  
✅ Focused on invoicing only  

## 📞 Support & Documentation

### Support Channels
- **WhatsApp**: +62-xxx-xxx-xxxx (Indonesian)
- **Email**: support@invoiceflow.id
- **Knowledge Base**: help.invoiceflow.id (bilingual)
- **Video Tutorials**: YouTube (Bahasa Indonesia)

### Documentation
- User guide in Bahasa Indonesia
- Video onboarding
- Invoice template examples
- PPN & NPWP guidelines
- Common questions (FAQ)

---

## Technical Implementation Notes

### Key Files & Functions
```
lib/
  ├── indonesian-utils.ts       # IDR format, NPWP, terbilang
  ├── i18n/
  │   ├── config.ts             # i18n configuration
  │   └── translations.ts       # ID/EN translations
  └── validations.ts            # NPWP validation, PPN rules

components/
  ├── forms/
  │   ├── invoice-form.tsx      # Main invoice form with PPN
  │   └── company-form.tsx      # Company profile with NPWP
  └── invoice/
      └── pdf-template.tsx      # Indonesian PDF format
```

### Database Fields
```sql
-- Companies
npwp VARCHAR(20)
is_pkp BOOLEAN
business_entity VARCHAR(50)
default_ppn_rate DECIMAL(5,2)
bank_name VARCHAR(100)
bank_account_number VARCHAR(50)

-- Invoices
client_npwp VARCHAR(20)
ppn_rate DECIMAL(5,2)
ppn_amount DECIMAL(15,2)
amount_in_words TEXT
currency VARCHAR(3) DEFAULT 'IDR'
payment_terms TEXT
```

---

**Document Prepared By:** Product Team  
**For Questions:** product@invoiceflow.id  
**Status:** Approved for Development

