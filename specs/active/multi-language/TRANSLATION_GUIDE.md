# Translation Contribution Guide

## 🌍 Adding New Translations

### 1. Add Keys to Translation Map

**Location:** `contexts/language-context.tsx`

```typescript
const translations = {
  id: {
    // Your Indonesian translation
    "your.new.key": "Teks dalam Bahasa Indonesia",
  },
  en: {
    // Your English translation
    "your.new.key": "Text in English",
  },
};
```

### 2. Key Naming Convention

Follow this hierarchical structure:

```
category.subcategory.item
```

**Examples:**
- `common.save` - Global actions
- `nav.dashboard` - Navigation items
- `invoice.create` - Invoice-specific actions
- `table.noResults` - Table/list states
- `error.notFound` - Error messages
- `validation.required` - Form validation

### 3. Use Translations in Components

**Client Components:**
```typescript
import { useLanguage } from "@/contexts/language-context";

export function MyComponent() {
  const { t, language } = useLanguage();
  
  return (
    <div>
      <h1>{t("mySection.title")}</h1>
      <p>{t("mySection.description")}</p>
    </div>
  );
}
```

**Date Localization:**
```typescript
import { format } from "date-fns";
import { id as idLocale, enUS as enLocale } from "date-fns/locale";
import { useLanguage } from "@/contexts/language-context";

const { language } = useLanguage();
const dateLocale = language === "id" ? idLocale : enLocale;

format(date, "dd MMM yyyy", { locale: dateLocale })
```

**Toast Notifications:**
```typescript
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";

const { toast } = useToast();
const { t } = useLanguage();

toast({
  title: t("success.saved"),
  description: t("success.savedDescription"),
});
```

## ✅ Translation Checklist

Before submitting translations:

- [ ] **Added both ID and EN translations**
- [ ] **Used semantic key naming** (category.item format)
- [ ] **Tested in UI** - Verified text displays correctly
- [ ] **Checked all states** - Normal, loading, error, empty
- [ ] **Verified length** - Text doesn't break layouts in either language
- [ ] **Toast notifications** - All use translation keys
- [ ] **No hard-coded text** - Removed bilingual strings like "Nama / Name"
- [ ] **Date formatting** - Uses dynamic locale if dates involved

## 🚫 Common Mistakes

### ❌ Don't:
```typescript
// Hard-coded bilingual strings
<button>Simpan / Save</button>

// Using translation keys for data
const statusFromDB = t("status.paid") // Wrong!

// Forgetting one language
translations.id = { "key": "Value" }
translations.en = { } // Missing!
```

### ✅ Do:
```typescript
// Use translation function
<button>{t("common.save")}</button>

// Translate UI labels, not data
const statusLabel = t(`status.${statusFromDB}`)

// Always add both languages
translations.id = { "common.save": "Simpan" }
translations.en = { "common.save": "Save" }
```

## 🔍 Finding Missing Translations

### 1. Check Console
Missing keys appear as warnings:
```
Warning: Translation key 'your.key' not found
```

### 2. Visual Inspection
Look for:
- Bilingual format: "Indonesian / English"
- Untranslated English text in Indonesian mode
- UI elements that don't change when switching language

### 3. Grep for Hard-coded Strings
```bash
# Find bilingual strings
grep -r "/ " components/

# Find toast without t()
grep -r 'toast({' components/ | grep -v 't("'
```

## 📱 Testing Translations

1. **Manual Test:**
   - Click language toggle (ID ↔ EN)
   - Navigate through all pages
   - Trigger all actions (save, delete, etc.)
   - Verify toasts, errors, and empty states

2. **Automated Test (Coming Soon):**
   ```typescript
   // Playwright test
   test('language switching', async ({ page }) => {
     await page.goto('/dashboard');
     await page.click('[data-testid="language-toggle"]');
     await expect(page.locator('h1')).toContainText('Dashboard');
   });
   ```

## 🌏 Future: Adding New Languages

To add a third language (e.g., Mandarin):

1. Update type:
```typescript
export type Language = "id" | "en" | "zh";
```

2. Add translations:
```typescript
const translations = {
  id: { ... },
  en: { ... },
  zh: {
    "common.save": "保存",
    // ... all other keys
  },
};
```

3. Update language switcher component

## 📞 Support

Questions? Check:
- [Feature Brief](./feature-brief.md) - Original requirements
- [Implementation Summary](./IMPLEMENTATION-SUMMARY.md) - What's been done
- [QA Checklist](./QA_CHECKLIST.md) - Testing guide

