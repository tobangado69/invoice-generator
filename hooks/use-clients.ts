'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type Client = {
  id: number;
  userId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  npwp?: string | null;
  contactPerson?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

async function fetchClients(search?: string) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  const res = await fetch(`/api/clients?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch clients');
  return res.json() as Promise<ApiResponse<Client[]>>;
}

async function createClient(data: Partial<Client>) {
  const res = await fetch('/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create client');
  return res.json() as Promise<ApiResponse<Client>>;
}

async function updateClient({ id, data }: { id: number; data: Partial<Client> }) {
  const res = await fetch(`/api/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update client');
  return res.json() as Promise<ApiResponse<Client>>;
}

async function deleteClient(id: number) {
  const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete client');
  return res.json();
}

export function useClients(search?: string) {
  return useQuery({
    queryKey: ['clients', search],
    queryFn: () => fetchClients(search),
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createClient,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateClient,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}
