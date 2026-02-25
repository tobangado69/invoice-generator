/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `email_verified` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Boolean` to `DateTime`.

*/
-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_companies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
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
INSERT INTO "new_companies" ("address", "bank_account_holder", "bank_account_number", "bank_name", "business_entity", "created_at", "default_ppn_rate", "email", "id", "is_pkp", "logo_url", "name", "npwp", "phone", "updated_at", "user_id") SELECT "address", "bank_account_holder", "bank_account_number", "bank_name", "business_entity", "created_at", "default_ppn_rate", "email", "id", "is_pkp", "logo_url", "name", "npwp", "phone", "updated_at", "user_id" FROM "companies";
DROP TABLE "companies";
ALTER TABLE "new_companies" RENAME TO "companies";
CREATE UNIQUE INDEX "companies_user_id_key" ON "companies"("user_id");
CREATE TABLE "new_invoices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
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
INSERT INTO "new_invoices" ("amount_in_words", "client_address", "client_email", "client_name", "client_npwp", "created_at", "currency", "due_date", "id", "invoice_number", "issue_date", "notes", "payment_terms", "pdf_path", "ppn_amount", "ppn_rate", "status", "subtotal", "total_amount", "updated_at", "user_id") SELECT "amount_in_words", "client_address", "client_email", "client_name", "client_npwp", "created_at", "currency", "due_date", "id", "invoice_number", "issue_date", "notes", "payment_terms", "pdf_path", "ppn_amount", "ppn_rate", "status", "subtotal", "total_amount", "updated_at", "user_id" FROM "invoices";
DROP TABLE "invoices";
ALTER TABLE "new_invoices" RENAME TO "invoices";
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "email_verified" DATETIME,
    "password_hash" TEXT NOT NULL,
    "image" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_users" ("created_at", "email", "email_verified", "id", "password_hash", "updated_at") SELECT "created_at", "email", "email_verified", "id", "password_hash", "updated_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");
