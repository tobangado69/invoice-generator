# Multi-Language Experience Enhancement Brief

**Task ID**: `multi-language`

**Status**: Planning (brief approved pending implementation)

## Problem, User, Success
- **Problem**: The language toggle (ID ↔ EN) exists but only translates selected sections. Several pages/components still show Indonesian-only or hard-coded English text, creating an inconsistent bilingual experience.
- **Primary Users**: Indonesian freelancers, agencies, and partners who collaborate with English-speaking clients or team members.
- **Definition of Success**: Every user-facing page respects the language toggle; copy loads from the translation system, language preference persists, and QA confirms parity between Indonesian and English views.

## Quick Research (15 min)
- **Current System**: `LanguageProvider` with flat key map, localStorage persistence, manual `t('key')` usage. Large coverage on landing/auth/invoice forms already.
- **Gaps observed** (manual scan + recent bug history):
  - Dashboard widgets, invoice tables, empty states, toasts, error messages still hard-coded.
  - Metadata (document titles, emails, toasts) not routed through i18n.
  - Server components and Next.js `generateMetadata` do not consume context.
  - Validation messages partly localized via Zod but some API responses still English-only.
  - No QA checklist or storybook coverage to ensure both languages remain in sync.
- **Benchmarks**: Remix, Next.js docs recommend central translation map + `next-intl` or `i18next`. Since we already have a bespoke context, fastest path is expanding coverage and standardizing usage.

## Requirements (Must Haves)
1. **Global Coverage**: All pages/components use `t()` for user-visible strings (landing, dashboard, invoices CRUD, profile, auth, error/empty states, toasts/modals).
2. **Server & Metadata Support**: Ensure page titles/meta descriptions switch language (App Router `generateMetadata` or client-side fallback).
3. **Validation & API Messages**: Align Zod schema messages and API error responses with language setting.
4. **Persistence**: Maintain current `localStorage` persistence and ensure hydration flicker is handled (default renders with saved locale).
5. **QA Checklist**: Provide matrix covering both languages per core flow. Document regression plan.
6. **Contribution Guide**: Add short guideline on how to add new translation keys + fallback strategy.

### Nice-to-Have (Stretch)
- RTL readiness audit (future) but note currently not required.
- Optional `Accept-Language` detection during first visit.
- Storybook (or Chromatic) snapshots for both locales.

## High-Level Solution Approach
1. **Translation Inventory**: Script or manual scan to list all hard-coded strings; create translation keys for missing copy.
2. **Shared Translation Helper**: Introduce helper for server-safe translations (e.g., `getTranslations(lang)`) for metadata / emails.
3. **Refactor Components**: Update components to rely solely on `t()` and avoid inline strings. Provide typed key enums for linting.
4. **Validation & API**: Centralize messages in `lib/i18n/messages.ts`; feed into Zod + API responses using current language (from session or request headers).
5. **Testing**: Add Cypress or Playwright smoke test switching languages. Snapshot key pages both locales.
6. **Docs**: Update `README`/`CONTRIBUTING` (or create short doc) on how to add translations, fallback behavior, QA checklist.

## Dependencies & Constraints
- Must remain compatible with current `LanguageProvider` (client component) unless replaced.
- App Router server components need either context bridging or duplication of translation map.
- Keep bundle size reasonable—avoid large i18n libraries unless necessary.

## Open Questions
- Should we support auto-detect based on browser language on first load? (Out of scope unless approved.)
- Do transactional emails/notifications exist that also need localization? (Confirm.)
- Can we accept slight delay before server metadata localization (if using client side)?

## Implementation Plan (Phased)
1. **Audit & Key Generation** (0.5 day)
   - Catalog strings, create new keys in `translations` object.
   - Decide naming convention for new keys (e.g., `dashboard.stats.totalInvoices`).
2. **Component Refactor** (1.5 days)
   - Update landing, dashboard, invoices, profile, auth, navigation, tables, modals, toasts.
   - Ensure hooks and utility messages use `t()`.
3. **Server/Metadata Localization** (0.5 day)
   - Provide helper for metadata translations.
   - Refactor `generateMetadata` or fallback to client update.
4. **Validation & API Messaging** (0.5 day)
   - Feed translation strings into Zod schemas.
   - Map API error responses based on `language` from session/request.
5. **QA & Documentation** (0.5 day)
   - Manual QA matrix (ID & EN) for major flows.
   - Add guidance to developer docs.

## Risks & Mitigation
- **Risk**: Missing keys causing fallback to raw keys. → Add console warn (already present) & QA checklist.
- **Risk**: Hydration mismatch due to delayed language load. → Default to saved language during SSR if possible, else skeleton to avoid flicker.
- **Risk**: Translation drift for new features. → Document contributor workflow & possibly lint rule later.

## Immediate Next Actions (Pre-Implementation)
- [ ] Confirm scope includes server metadata & API messages.
- [ ] Align on translation key naming convention.
- [ ] Prepare checklist of pages/components for audit.
- [ ] Approve brief, then create implementation TODOs.
