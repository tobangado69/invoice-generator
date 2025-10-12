/**
 * Auth Layout
 * Layout for login and register pages
 */

import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            InvoiceFlow
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generator Invoice untuk UMKM Indonesia
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
