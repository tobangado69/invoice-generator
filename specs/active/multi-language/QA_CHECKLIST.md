# Multi-Language QA Checklist

## 🎯 Test Coverage Matrix

Test **BOTH** Indonesian (ID) and English (EN) for each flow.

---

## 1. Landing Page (/

)

| Feature | ID | EN | Notes |
|---------|----|----|-------|
| Hero title & subtitle | ⬜ | ⬜ | |
| CTA buttons | ⬜ | ⬜ | "Mulai Gratis" / "Start Free" |
| Features section | ⬜ | ⬜ | All 4 feature cards |
| How It Works steps | ⬜ | ⬜ | 3 steps |
| Footer links | ⬜ | ⬜ | |

---

## 2. Authentication

### Login Page (/login)
| Feature | ID | EN | Notes |
|---------|----|----|-------|
| Page title | ⬜ | ⬜ | "Masuk" / "Login" |
| Form labels | ⬜ | ⬜ | Email, Password |
| Login button | ⬜ | ⬜ | |
| Success toast | ⬜ | ⬜ | After successful login |
| Error message | ⬜ | ⬜ | Invalid credentials |
| "Don't have account" link | ⬜ | ⬜ | |

### Register Page (/register)
| Feature | ID | EN | Notes |
|---------|----|----|-------|
| Page title | ⬜ | ⬜ | "Daftar" / "Register" |
| Form labels | ⬜ | ⬜ | Name, Email, Password |
| Register button | ⬜ | ⬜ | |
| Success toast | ⬜ | ⬜ | After registration |
| "Already have account" link | ⬜ | ⬜ | |

---

## 3. Dashboard (/dashboard)

| Feature | ID | EN | Notes |
|---------|----|----|-------|
| Welcome message | ⬜ | ⬜ | "Selamat datang" / "Welcome" |
| Subtitle | ⬜ | ⬜ | "Ringkasan invoice" / "Quick overview" |
| Stat cards (4x) | ⬜ | ⬜ | Total, Pending, Paid, PPN |
| "Create Invoice" button | ⬜ | ⬜ | |
| "Recent Invoices" heading | ⬜ | ⬜ | |
| Invoice table | ⬜ | ⬜ | Headers, data, empty state |

---

## 4. Invoice Table Component

| Feature | ID | EN | Notes |
|---------|----|----|-------|
| Table title | ⬜ | ⬜ | "Invoice" / "Invoices" |
| Search placeholder | ⬜ | ⬜ | "Cari invoice..." / "Search..." |
| Status filter | ⬜ | ⬜ | All, Draft, Sent, Paid, Overdue |
| Column headers (7x) | ⬜ | ⬜ | Number, Client, Date, Due, Total, Status, Actions |
| Status badges | ⬜ | ⬜ | Draft, Sent, Paid, Overdue |
| "View" button | ⬜ | ⬜ | |
| Empty state | ⬜ | ⬜ | No invoices message |
| No results state | ⬜ | ⬜ | After search/filter |
| Date formatting | ⬜ | ⬜ | Uses correct locale (id/en) |

---

## 5. Invoice Detail Page (/invoices/[id])

| Feature | ID | EN | Notes |
|---------|----|----|-------|
| "Back to List" button | ⬜ | ⬜ | |
| Invoice preview | ⬜ | ⬜ | All fields |
| "View PDF" button | ⬜ | ⬜ | |
| "Download PDF" button | ⬜ | ⬜ | |
| "Mark Paid" button | ⬜ | ⬜ | |
| "Mark Sent" button | ⬜ | ⬜ | |
| "Delete" button | ⬜ | ⬜ | |
| PDF opened toast | ⬜ | ⬜ | After opening PDF |
| PDF downloaded toast | ⬜ | ⬜ | After download |
| Status updated toast | ⬜ | ⬜ | After marking paid/sent |
| Deleted toast | ⬜ | ⬜ | After deletion |
| Error toast | ⬜ | ⬜ | If action fails |
| Not found state | ⬜ | ⬜ | Invalid invoice ID |

---

## 6. Create Invoice Page (/invoices/new)

| Feature | ID | EN | Notes |
|---------|----|----|-------|
| Page title | ⬜ | ⬜ | "Buat Invoice" / "Create Invoice" |
| Invoice info section | ⬜ | ⬜ | Number, Date, Due Date |
| Client info section | ⬜ | ⬜ | Name, Email, Address, NPWP |
| Items section | ⬜ | ⬜ | Description, Qty, Rate, Amount |
| "Add Item" button | ⬜ | ⬜ | |
| PPN toggle & rate | ⬜ | ⬜ | "Gunakan PPN" / "Use VAT" |
| Payment terms | ⬜ | ⬜ | |
| Notes field | ⬜ | ⬜ | |
| Subtotal, PPN, Total | ⬜ | ⬜ | |
| Terbilang | ⬜ | ⬜ | Amount in words |
| "Save Draft" button | ⬜ | ⬜ | |
| "Create & Send" button | ⬜ | ⬜ | |
| Validation errors | ⬜ | ⬜ | Client name, items required |
| NPWP validation | ⬜ | ⬜ | Invalid format message |
| Success toast | ⬜ | ⬜ | Invoice created |

---

## 7. Profile Page (/profile)

| Feature | ID | EN | Notes |
|---------|----|----|-------|
| Page title | ⬜ | ⬜ | "Profil Perusahaan" / "Company Profile" |
| All form labels (13x) | ⬜ | ⬜ | Name, Business Entity, Address, etc. |
| PKP switch & description | ⬜ | ⬜ | |
| "Save" button | ⬜ | ⬜ | |
| NPWP validation | ⬜ | ⬜ | Invalid format message |
| Success toast | ⬜ | ⬜ | Profile saved |
| Error toast | ⬜ | ⬜ | Save failed |
| Loading state | ⬜ | ⬜ | |

---

## 8. Header & Navigation

| Feature | ID | EN | Notes |
|---------|----|----|-------|
| Logo | ⬜ | ⬜ | |
| Nav items | ⬜ | ⬜ | Dashboard, Invoices, Profile |
| "Create New" button | ⬜ | ⬜ | |
| Language toggle | ⬜ | ⬜ | ID ↔ EN |
| Logout button | ⬜ | ⬜ | |
| Logout success toast | ⬜ | ⬜ | |

---

## 9. Edge Cases & Error States

| Scenario | ID | EN | Notes |
|----------|----|----|-------|
| Network error | ⬜ | ⬜ | "Kesalahan jaringan" / "Network error" |
| 404 Not Found | ⬜ | ⬜ | |
| Unauthorized access | ⬜ | ⬜ | |
| Empty states (all pages) | ⬜ | ⬜ | |
| Loading skeletons | ⬜ | ⬜ | Should be language-neutral |

---

## 10. Language Persistence

| Test | Result | Notes |
|------|--------|-------|
| Switch to EN, refresh page | ⬜ | Should stay in EN |
| Switch to ID, refresh page | ⬜ | Should stay in ID |
| Switch language, navigate pages | ⬜ | Should persist across navigation |
| New incognito window | ⬜ | Should default to ID |
| Clear localStorage, refresh | ⬜ | Should default to ID |

---

## 11. Visual & Layout Testing

| Aspect | ID | EN | Notes |
|--------|----|----|-------|
| Text doesn't overflow | ⬜ | ⬜ | Especially buttons, cards |
| Line breaks natural | ⬜ | ⬜ | No awkward wrapping |
| Buttons same size | ⬜ | ⬜ | Consistent across languages |
| Table columns aligned | ⬜ | ⬜ | Headers and data |
| Mobile responsive | ⬜ | ⬜ | Test on 320px, 768px, 1024px |
| Dark mode (if applicable) | ⬜ | ⬜ | |

---

## 12. Date & Number Formatting

| Feature | ID | EN | Notes |
|---------|----|----|-------|
| Invoice table dates | ⬜ | ⬜ | "15 Okt 2025" vs "Oct 15, 2025" |
| Invoice detail dates | ⬜ | ⬜ | |
| Dashboard dates | ⬜ | ⬜ | |
| Currency formatting | ⬜ | ⬜ | Should always be IDR |
| Terbilang (amount in words) | ⬜ | ⬜ | Only in Indonesian |

---

## 📝 Testing Notes

### Automated Testing (Future)
```bash
# Run E2E tests
npm run test:e2e

# Run language-specific tests
npm run test:e2e -- --grep "language"
```

### Manual Testing Steps
1. **Switch to Indonesian:**
   - Click language toggle → ID
   - Navigate through all pages
   - Check every section above

2. **Switch to English:**
   - Click language toggle → EN
   - Navigate through all pages
   - Check every section above

3. **Perform Actions:**
   - Create invoice
   - Edit profile
   - Delete invoice
   - Verify all toasts in both languages

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari
- [ ] Mobile Chrome

---

## ✅ Sign-Off

| Tester | Language | Date | Status | Notes |
|--------|----------|------|--------|-------|
|  | ID | | ⬜ Pass / ⬜ Fail | |
|  | EN | | ⬜ Pass / ⬜ Fail | |

**Critical Issues Found:**
- [ ] None
- [ ] [List any critical issues]

**Minor Issues Found:**
- [ ] None
- [ ] [List any minor issues]

---

## 🐛 Bug Report Template

```markdown
**Bug:** [Brief description]
**Language:** ID / EN
**Page:** /dashboard
**Steps to Reproduce:**
1. Click language toggle
2. Navigate to...
3. Click...

**Expected:** Should show "..." in [language]
**Actual:** Shows "..."
**Screenshot:** [Attach if applicable]
```

