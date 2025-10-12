# Comprehensive Testing & Bug Fix Plan

**Task ID:** `comprehensive-testing`  
**Created:** October 11, 2025  
**Status:** Ready to Execute  

## 🎯 Problem Statement

After migrating from Better Auth to NextAuth.js and fixing multiple bugs, we need to systematically test ALL features to ensure the system is fully functional. Current known issue: PDF generation still has a React error #31.

## 👤 User Impact

**Who:** All users (UMKM, freelancers)
**Current State:** Most features work, but PDF generation fails
**Desired State:** Every feature tested and working end-to-end

## 🔍 Current System State (Quick Research)

### ✅ What's Working
1. ✅ Landing page with Indonesian translations
2. ✅ User registration (/api/auth/register)
3. ✅ Language switcher (ID/EN)
4. ✅ Database schema (NextAuth compatible)
5. ✅ API routes updated for string UUIDs
6. ✅ Server running without compilation errors

### ❌ Known Issues
1. ❌ **PDF Generation** - React minified error #31
2. ⚠️ **Login** - Not tested yet
3. ⚠️ **Company Profile** - Not tested yet
4. ⚠️ **Invoice Creation** - Not tested yet
5. ⚠️ **Middleware** - Not tested yet

## 📋 Testing Checklist

### Phase 1: Authentication Flow (Priority: CRITICAL)
- [ ] **Registration**
  - [ ] Register new user via UI
  - [ ] Verify password hashing in database
  - [ ] Check auto-login after registration
  - [ ] Verify redirect to dashboard

- [ ] **Login**
  - [ ] Login with valid credentials
  - [ ] Test invalid credentials error
  - [ ] Verify session creation
  - [ ] Check dashboard access after login

- [ ] **Session**
  - [ ] Refresh page - session persists
  - [ ] Check session expiry (7 days config)
  - [ ] Verify JWT token structure

- [ ] **Logout**
  - [ ] Logout functionality
  - [ ] Session cleared
  - [ ] Redirect to landing page

### Phase 2: Route Protection (Priority: HIGH)
- [ ] **Middleware**
  - [ ] Access /dashboard without auth → Redirect to /login
  - [ ] Access /invoices without auth → Redirect to /login
  - [ ] Access /profile without auth → Redirect to /login
  - [ ] Access /login when authenticated → Redirect to /dashboard
  - [ ] Access /register when authenticated → Redirect to /dashboard

### Phase 3: Company Profile (Priority: HIGH)
- [ ] **Profile Creation**
  - [ ] Fill company name (required)
  - [ ] Select business entity (PT, CV, etc.)
  - [ ] Enter NPWP with auto-formatting
  - [ ] Validate NPWP format
  - [ ] Toggle PKP status
  - [ ] Set default PPN rate
  - [ ] Add bank details
  - [ ] Save profile → Success toast

- [ ] **Profile Update**
  - [ ] Edit existing profile
  - [ ] Changes persist in database
  - [ ] Profile data loads on page refresh

### Phase 4: Invoice Management (Priority: CRITICAL)
- [ ] **Invoice Creation**
  - [ ] Auto-generate invoice number
  - [ ] Fill client details
  - [ ] Add multiple line items
  - [ ] Quantity/rate auto-calculate amount
  - [ ] Toggle PPN (11%)
  - [ ] View subtotal, PPN, total
  - [ ] View terbilang in Indonesian
  - [ ] Select payment terms
  - [ ] Add notes
  - [ ] Save as draft
  - [ ] Create and send

- [ ] **Invoice List**
  - [ ] View all invoices
  - [ ] Filter by status (draft, sent, paid, overdue)
  - [ ] Search by invoice number/client name
  - [ ] IDR formatting in table
  - [ ] Click to view invoice details

- [ ] **Invoice Detail**
  - [ ] View complete invoice
  - [ ] All calculations correct
  - [ ] Terbilang displays properly
  - [ ] Mark as paid
  - [ ] Mark as sent
  - [ ] Delete invoice

- [ ] **PDF Generation** ⚠️ NEEDS FIX
  - [ ] Click download PDF button
  - [ ] PDF generates without errors
  - [ ] PDF includes company details
  - [ ] PDF includes client details
  - [ ] PDF shows line items correctly
  - [ ] PDF displays PPN breakdown
  - [ ] PDF shows terbilang
  - [ ] PDF includes bank details
  - [ ] PDF file downloads correctly

### Phase 5: Dashboard (Priority: MEDIUM)
- [ ] **Stats Display**
  - [ ] Total invoices count
  - [ ] Pending amount (unpaid)
  - [ ] Paid amount
  - [ ] PPN collected

- [ ] **Recent Invoices**
  - [ ] Shows last 5 invoices
  - [ ] Click to view details

### Phase 6: UI/UX (Priority: MEDIUM)
- [ ] **Translations**
  - [ ] All Indonesian keys display correctly
  - [ ] All English keys display correctly
  - [ ] Language persists in localStorage
  - [ ] Language switcher works on all pages

- [ ] **Responsive Design**
  - [ ] Mobile view (375px)
  - [ ] Tablet view (768px)
  - [ ] Desktop view (1024px+)

- [ ] **Error Handling**
  - [ ] Form validation errors display
  - [ ] API errors show toast notifications
  - [ ] Loading states show spinners
  - [ ] Network errors handled gracefully

## 🛠 Bug Fix Strategy

### Current PDF Generation Error

**Error:** React minified error #31 with `renderToStream`

**Root Cause Analysis:**
1. `React.createElement(InvoicePDF, ...)` creates a component element
2. `InvoicePDF` returns a `<Document>` which is the correct PDF structure
3. `renderToStream` expects this Document element
4. Error suggests the element structure is invalid

**Potential Fixes to Try:**
1. ✅ Already tried: Switch from renderToBuffer to renderToStream
2. ⏭️ Try: Use dynamic import to avoid SSR issues
3. ⏭️ Try: Render on client-side and send to API
4. ⏭️ Try: Use pdf-lib instead of @react-pdf/renderer
5. ⏭️ Try: Simplify InvoicePDF component structure

**Fix Implementation:**
```typescript
// Option 1: Dynamic import (prevents SSR issues)
const { renderToStream } = await import('@react-pdf/renderer');

// Option 2: Simpler approach - use pdf() method
import { pdf } from '@react-pdf/renderer';
const blob = await pdf(<InvoicePDF />).toBlob();

// Option 3: Generate on demand
const instance = pdf(React.createElement(InvoicePDF, { invoice, company }));
const buffer = await instance.toBuffer();
```

## 🎯 Success Criteria

### Must Pass All Tests
- [ ] Authentication: 100% (register, login, logout, session)
- [ ] Company Profile: 100% (create, update, validate)
- [ ] Invoice CRUD: 100% (create, read, update, delete)
- [ ] PDF Generation: 100% (download works)
- [ ] Translations: 100% (both languages)
- [ ] Middleware: 100% (redirects work)

### Performance
- [ ] Page load < 2s
- [ ] API responses < 500ms
- [ ] PDF generation < 3s

### Data Integrity
- [ ] User data isolated (can't access others' data)
- [ ] Calculations accurate (PPN, totals, terbilang)
- [ ] NPWP validation correct

## 📝 Immediate Next Actions

1. **Fix PDF Generation** (15 min)
   - Try `pdf().toBuffer()` approach
   - Test with sample invoice
   - Verify download works

2. **Test Authentication Flow** (10 min)
   - Register via browser
   - Login via browser
   - Test session persistence

3. **Test Company Profile** (10 min)
   - Create profile with all fields
   - Test NPWP validation
   - Verify save/load

4. **Test Invoice Creation** (15 min)
   - Create invoice with multiple items
   - Verify calculations
   - Test draft vs sent

5. **Test PDF Generation** (5 min)
   - After fixing, download PDF
   - Verify content accuracy

6. **Test Complete User Journey** (10 min)
   - Register → Profile → Invoice → PDF
   - Full flow without errors

## 🔧 Tools & Methods

- **Manual Testing:** Browser-based user flows
- **API Testing:** Postman/curl for endpoints
- **Database Inspection:** Prisma Studio
- **Console Monitoring:** Browser DevTools
- **Server Logs:** Terminal output

## 📊 Expected Outcomes

- **Bug Report:** Document any issues found
- **Fix Implementation:** Resolve all critical bugs
- **Test Report:** Pass/fail for each feature
- **Production Readiness:** Confirm system is ready

---

**Time Estimate:** 60-90 minutes for complete testing & fixes
