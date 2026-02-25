"use client";

/**
 * Invoices List Page
 * Shows all invoices with filters and search
 */

import { InvoiceTable } from "@/components/invoice-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Invoices</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your invoices
          </p>
        </div>
        <Link href="/invoices/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>
      <InvoiceTable />
    </div>
  );
}
