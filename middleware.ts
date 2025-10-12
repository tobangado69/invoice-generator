/**
 * NextAuth Middleware - Edge Runtime Compatible
 * Protects routes and handles authentication redirects
 * Fixed for NextAuth v5 + Edge Runtime compatibility
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                     req.nextUrl.pathname.startsWith('/register');
  const isProtectedPage = req.nextUrl.pathname.startsWith('/dashboard') ||
                         req.nextUrl.pathname.startsWith('/invoices') ||
                         req.nextUrl.pathname.startsWith('/profile');

  // Skip auth check for non-protected pages
  if (!isAuthPage && !isProtectedPage) {
    return NextResponse.next();
  }

  // Get token using next-auth/jwt (edge-compatible)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
  });

  const isLoggedIn = !!token;

  // Redirect unauthenticated users from protected pages to login
  if (isProtectedPage && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth pages to dashboard
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ]
};
