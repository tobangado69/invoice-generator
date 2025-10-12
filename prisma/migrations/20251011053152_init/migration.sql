-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "companies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "business_entity" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "npwp" TEXT,
    "is_pkp" BOOLEAN NOT NULL DEFAULT false,
    "bank_name" TEXT,
    "bank_account_number" TEXT,
    "bank_account_holder" TEXT,
    "logo_url" TEXT,
    "default_ppn_rate" REAL NOT NULL DEFAULT 11.0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_email" TEXT,
    "client_address" TEXT,
    "client_npwp" TEXT,
    "issue_date" DATETIME NOT NULL,
    "due_date" DATETIME NOT NULL,
    "subtotal" REAL NOT NULL,
    "ppn_rate" REAL NOT NULL DEFAULT 0,
    "ppn_amount" REAL NOT NULL DEFAULT 0,
    "total_amount" REAL NOT NULL,
    "amount_in_words" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "notes" TEXT,
    "payment_terms" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "pdf_path" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "invoices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "invoice_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" REAL NOT NULL DEFAULT 1,
    "rate" REAL NOT NULL,
    "amount" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_user_id_key" ON "companies"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");
