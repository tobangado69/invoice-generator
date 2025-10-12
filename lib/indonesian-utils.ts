/**
 * Indonesian Utilities for InvoiceFlow
 * Handles IDR formatting, NPWP validation, terbilang conversion, and PPN calculations
 */

/**
 * Format number to Indonesian Rupiah
 * Example: 1000000 => "Rp 1.000.000"
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format NPWP with dots and dash
 * Input: 123456789012345 => Output: 12.345.678.9-012.345
 */
export function formatNPWP(npwp: string): string {
  const cleaned = npwp.replace(/\D/g, '');
  if (cleaned.length !== 15) return npwp;
  
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}.${cleaned.slice(8, 9)}-${cleaned.slice(9, 12)}.${cleaned.slice(12, 15)}`;
}

/**
 * Validate NPWP format (XX.XXX.XXX.X-XXX.XXX)
 */
export function validateNPWP(npwp: string): boolean {
  return /^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/.test(npwp);
}

/**
 * Clean NPWP by removing non-digits
 */
export function cleanNPWP(npwp: string): string {
  return npwp.replace(/\D/g, '');
}

/**
 * Convert number to Indonesian words (Terbilang)
 * Example: 1500000 => "Satu Juta Lima Ratus Ribu Rupiah"
 */
export function terbilang(angka: number): string {
  const huruf = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 
    'Enam', 'Tujuh', 'Delapan', 'Sembilan', 
    'Sepuluh', 'Sebelas'
  ];

  // Handle zero
  if (angka === 0) return 'Nol Rupiah';

  // Round to nearest integer for readability
  angka = Math.round(angka);

  if (angka < 12) return huruf[angka];
  if (angka < 20) return terbilang(angka - 10) + ' Belas';
  if (angka < 100) {
    const puluh = terbilang(Math.floor(angka / 10)) + ' Puluh';
    const sisa = angka % 10;
    return sisa === 0 ? puluh.trim() : puluh + ' ' + terbilang(sisa);
  }
  if (angka < 200) return 'Seratus ' + terbilang(angka - 100);
  if (angka < 1000) {
    const ratus = terbilang(Math.floor(angka / 100)) + ' Ratus';
    const sisa = angka % 100;
    return sisa === 0 ? ratus.trim() : ratus + ' ' + terbilang(sisa);
  }
  if (angka < 2000) return 'Seribu ' + terbilang(angka - 1000);
  if (angka < 1000000) {
    const ribu = terbilang(Math.floor(angka / 1000)) + ' Ribu';
    const sisa = angka % 1000;
    return sisa === 0 ? ribu.trim() : ribu + ' ' + terbilang(sisa);
  }
  if (angka < 1000000000) {
    const juta = terbilang(Math.floor(angka / 1000000)) + ' Juta';
    const sisa = angka % 1000000;
    return sisa === 0 ? juta.trim() : juta + ' ' + terbilang(sisa);
  }
  if (angka < 1000000000000) {
    const miliar = terbilang(Math.floor(angka / 1000000000)) + ' Miliar';
    const sisa = angka % 1000000000;
    return sisa === 0 ? miliar.trim() : miliar + ' ' + terbilang(sisa);
  }
  
  return angka.toString() + ' Rupiah';
}

/**
 * Calculate PPN (Pajak Pertambahan Nilai / VAT)
 * Default rate is 11% (Indonesian standard)
 */
export function calculatePPN(subtotal: number, rate: number = 11): number {
  return Math.round(subtotal * (rate / 100) * 100) / 100;
}

/**
 * Generate Indonesian invoice number format: INV/YYYY/MM/XXX
 * Example: INV/2025/10/001
 */
export function generateInvoiceNumber(lastNumber: string | null): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  if (!lastNumber) {
    return `INV/${year}/${month}/001`;
  }
  
  const parts = lastNumber.split('/');
  if (parts.length === 4 && parts[0] === 'INV' && parts[1] === String(year) && parts[2] === month) {
    const sequence = String(Number(parts[3]) + 1).padStart(3, '0');
    return `INV/${year}/${month}/${sequence}`;
  }
  
  // New month or year, reset to 001
  return `INV/${year}/${month}/001`;
}

/**
 * Format date to Indonesian locale
 * Example: "11 Oktober 2025"
 */
export function formatIndonesianDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Indonesian business entity types
 */
export const BUSINESS_ENTITIES = [
  { value: 'Perorangan', label: 'Perorangan (Individual)' },
  { value: 'CV', label: 'CV (Commanditaire Vennootschap)' },
  { value: 'PT', label: 'PT (Perseroan Terbatas)' },
  { value: 'UD', label: 'UD (Usaha Dagang)' },
  { value: 'Firma', label: 'Firma (Partnership)' },
] as const;

/**
 * Indonesian payment terms presets
 */
export const PAYMENT_TERMS_PRESETS = [
  'Pembayaran dalam 7 hari',
  'Pembayaran dalam 14 hari',
  'Pembayaran dalam 30 hari',
  'Transfer sebelum barang dikirim',
  '50% DP, 50% pelunasan',
  'Net 30',
  'Cash on Delivery (COD)',
] as const;

