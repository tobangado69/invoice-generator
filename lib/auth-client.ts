/**
 * NextAuth Client Utilities
 * Client-side authentication functions
 */

'use client';

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

/**
 * Sign in with credentials
 */
export async function signIn(email: string, password: string) {
  const result = await nextAuthSignIn("credentials", {
    email,
    password,
    redirect: false,
  });

  return result;
}

/**
 * Sign up new user
 */
export async function signUp(name: string, email: string, password: string) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
}

/**
 * Sign out
 */
export async function signOut() {
  await nextAuthSignOut({ redirect: false });
}
