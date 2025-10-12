/**
 * Invoice React Query Hooks
 * Provides data fetching and mutation hooks for invoices
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Invoice, PaginatedResponse, ApiResponse } from '@/types/invoice';

// API client functions
async function fetchInvoices(filters?: { status?: string; page?: number; limit?: number }) {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.page) params.set('page', filters.page.toString());
  if (filters?.limit) params.set('limit', filters.limit.toString());

  const response = await fetch(`/api/invoices?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch invoices');
  return response.json() as Promise<PaginatedResponse<Invoice>>;
}

async function fetchInvoice(id: number) {
  const response = await fetch(`/api/invoices/${id}`);
  if (!response.ok) throw new Error('Failed to fetch invoice');
  return response.json() as Promise<ApiResponse<Invoice>>;
}

async function createInvoice(data: any) {
  const response = await fetch('/api/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create invoice');
  return response.json() as Promise<ApiResponse<Invoice>>;
}

async function updateInvoice({ id, data }: { id: number; data: any }) {
  const response = await fetch(`/api/invoices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update invoice');
  return response.json() as Promise<ApiResponse<Invoice>>;
}

async function deleteInvoice(id: number) {
  const response = await fetch(`/api/invoices/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete invoice');
  return response.json();
}

// React Query Hooks
export function useInvoices(filters?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => fetchInvoices(filters),
  });
}

export function useInvoice(id: number | null) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => fetchInvoice(id!),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateInvoice,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

