# Migration: Better Auth → NextAuth.js

**Task ID:** `change-auth`  
**Created:** October 11, 2025  
**Status:** Planning  

## 🎯 Problem Statement

Better Auth has persistent issues with Prisma adapter - it fails to pass the password field during user creation, causing 422 errors. After multiple fix attempts, it's clear that Better Auth has compatibility issues with our setup. We need to migrate to NextAuth.js (Auth.js v5), which is more mature, widely adopted, and has better Prisma integration.

## 👤 User Impact

**Who:** All users attempting to register/login
**Current State:** Cannot create accounts due to Better Auth adapter bug
**Desired State:** Seamless registration and login with NextAuth.js

**Success Metrics:**
- ✅ Users can register successfully
- ✅ Users can login and maintain session
- ✅ Protected routes work with middleware
- ✅ No authentication errors in console

## 🔍 Quick Research (15 min)

### Current Better Auth Implementation
**Files Using Better Auth:**
- `lib/auth.ts` - Better Auth configuration
- `lib/auth-client.ts` - Client-side auth utilities
- `hooks/use-auth.ts` - Auth hook
- `app/api/auth/[...all]/route.ts` - Auth API route
- `app/(auth)/login/page.tsx` - Login page
- `app/(auth)/register/page.tsx` - Register page
- `components/site-header.tsx` - Uses auth for user dropdown
- `middleware.ts` - Route protection
- All API routes (`/api/company`, `/api/invoices/*`) - Session checks

### NextAuth.js v5 (Auth.js) Pattern
```typescript
// auth.ts - Configuration
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // Custom validation logic
      },
    }),
  ],
  session: { strategy: "jwt" },
})
```

### Prisma Schema for NextAuth
NextAuth requires specific models: User, Account, Session, VerificationToken

## 📋 Essential Requirements

### 1. Replace Better Auth with NextAuth.js
- [ ] Install `next-auth@beta` and `@auth/prisma-adapter`
- [ ] Update Prisma schema with NextAuth models
- [ ] Configure NextAuth with Credentials provider
- [ ] Create custom register endpoint

### 2. Update Authentication Files
- [ ] Rewrite `lib/auth.ts` with NextAuth configuration
- [ ] Rewrite `lib/auth-client.ts` for client-side usage
- [ ] Update `hooks/use-auth.ts` to use NextAuth session
- [ ] Update `app/api/auth/[...all]/route.ts` → `app/api/auth/[...nextauth]/route.ts`

### 3. Update All Auth Consumers
- [ ] Update login page to use NextAuth signIn
- [ ] Update register page with custom registration + auto-login
- [ ] Update site header to use NextAuth session
- [ ] Update middleware for NextAuth session checks
- [ ] Update all API routes to use NextAuth session

### 4. Custom Registration Flow
Since NextAuth Credentials doesn't include built-in registration:
- [ ] Create `/api/auth/register` custom endpoint
- [ ] Hash passwords with bcryptjs
- [ ] Auto-login after successful registration

## 🛠 Implementation Approach

### Phase 1: Install & Configure NextAuth (10 min)
1. Install packages
2. Update Prisma schema with NextAuth models
3. Reset database
4. Create NextAuth configuration

### Phase 2: Update Core Auth Files (15 min)
1. Rewrite `lib/auth.ts` with NextAuth
2. Create auth route handler
3. Create custom registration API
4. Update client-side utilities

### Phase 3: Update UI Components (15 min)
1. Update login page
2. Update register page  
3. Update site header
4. Update middleware

### Phase 4: Update API Routes (10 min)
1. Update company API
2. Update invoices API
3. Update PDF generation API

### Phase 5: Testing (10 min)
1. Test registration flow
2. Test login flow
3. Test session persistence
4. Test protected routes

## 🎯 Success Criteria

- [ ] User can register with name, email, password
- [ ] Password is hashed with bcryptjs
- [ ] User can login successfully  
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect to login
- [ ] Logout works correctly
- [ ] All API routes validate session
- [ ] No console errors

## 📝 Immediate Next Actions

1. **Update Prisma schema** with NextAuth models (User, Account, Session, VerificationToken)
2. **Create NextAuth config** in `lib/auth.ts`
3. **Create registration API** at `/api/auth/register`
4. **Update auth route** handler
5. **Update login/register pages**
6. **Update all session checks** in API routes

## 🔧 Key Implementation Details

### Prisma Schema Changes
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime? @map("email_verified")
  password      String    @map("password_hash")
  image         String?
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  accounts      Account[]
  sessions      Session[]
  company       Company?
  invoices      Invoice[]
  
  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

### Custom Registration Endpoint
```typescript
// app/api/auth/register/route.ts
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
  
  return Response.json({ success: true, user });
}
```

### NextAuth Configuration
```typescript
// lib/auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user || !await bcrypt.compare(credentials.password, user.password)) {
          return null;
        }
        
        return user;
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
})
```

## 📊 Expected Outcomes

- **Working authentication** with proven library
- **Simpler codebase** - less custom configuration
- **Better documentation** - NextAuth has extensive docs
- **Easier debugging** - larger community support

---

**Time Estimate:** 60 minutes total (including testing)
