# AGENTS.md

## Cursor Cloud specific instructions

### Overview
InvoiceFlow is a single Next.js 15 application (App Router) with embedded SQLite via Prisma. No external services, Docker, or background workers are needed.

### Environment files
- `.env.local` — used by Next.js at runtime (contains `DATABASE_URL`, `NEXTAUTH_SECRET`, `AUTH_URL`, `AUTH_TRUST_HOST`)
- `.env` — used by Prisma CLI commands (`prisma migrate`, `prisma generate`). Must at minimum contain `DATABASE_URL="file:./dev.db"`.
- Prisma CLI does **not** read `.env.local`; if you run `npx prisma migrate dev` without a `.env` file, it will fail with "Environment variable not found: DATABASE_URL".

### Common commands
See `package.json` `scripts` section for the full list. Key commands:
- `npm run dev` — start dev server on port 3000
- `npm run build` — production build
- `npm run lint` — ESLint (uses ESLint 8 + `eslint-config-next@15` with `.eslintrc.json`)
- `npm run db:migrate` — run Prisma migrations (needs `DATABASE_URL` in `.env`)
- `npm run db:generate` — regenerate Prisma client after schema changes

### Gotchas
- The project's initial migration (`20251011053152_init`) predates the current `schema.prisma` (which added Account/Session/VerificationToken models and changed User ID to cuid). Running `prisma migrate dev` on a fresh DB will create an additional migration to reconcile the diff. This is expected and harmless.
- `next lint` is deprecated in Next.js 15.5+ and prints a warning. It still works with ESLint 8 and `.eslintrc.json`.
- There is one pre-existing lint error in `app/profile/page.tsx` (unescaped `'` entity) — this is in the existing codebase, not introduced by setup.
- The `next.config.mjs` sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`, so `npm run build` will succeed even with lint/type issues.

### New SaaS pages
- `/pricing` — Public pricing page with plan comparison, FAQ
- `/clients` — Authenticated client management (CRUD with search)
- `/settings` — Account settings, plan info, usage tracking
- Subscription plan config is in `lib/plans.ts` (Free/Pro/Business tiers)
- Client API routes at `/api/clients` and `/api/clients/[id]`

### Testing
No automated test framework is configured. Manual testing is done via the browser (see `README.md` for the manual testing checklist). Register at `/register`, login at `/login`, then create invoices at `/invoices/new`.
