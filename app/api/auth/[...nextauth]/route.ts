/**
 * NextAuth.js API Route Handler
 * Handles all authentication endpoints
 */

import { handlers } from "@/lib/auth";

// Force Node.js runtime (required for bcrypt)
export const runtime = 'nodejs';

export const { GET, POST } = handlers;

