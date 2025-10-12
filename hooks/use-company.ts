/**
 * Company React Query Hooks
 * Provides data fetching and mutation hooks for company profile
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CompanyProfile, ApiResponse } from '@/types/invoice';

// API client functions
async function fetchCompany() {
  const response = await fetch('/api/company');
  if (!response.ok) throw new Error('Failed to fetch company');
  return response.json() as Promise<ApiResponse<CompanyProfile | null>>;
}

async function updateCompany(data: any) {
  const response = await fetch('/api/company', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update company');
  return response.json() as Promise<ApiResponse<CompanyProfile>>;
}

// React Query Hooks
export function useCompany() {
  return useQuery({
    queryKey: ['company'],
    queryFn: fetchCompany,
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company'] });
    },
  });
}

