import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { ApiError } from '../types/common.types';

/**
 * Hook genérico para consultas GET con React Query
 */
export function useApi<TData = unknown>(
  key: string | string[],
  fetcher: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, ApiError>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: fetcher,
    ...options,
  });
}

/**
 * Hook genérico para mutaciones POST/PUT/DELETE con React Query
 */
export function useApiMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, ApiError, TVariables>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn,
    ...options,
  });
}
