import { useApi } from './useApi';
import { fenomenosApi } from '../api/fenomenos';
import { FenomenoFilters } from '../types/fenomeno.types';

export function useFenomenos(filters?: FenomenoFilters) {
  return useApi(
    ['fenomenos', JSON.stringify(filters || {})],
    () => fenomenosApi.getAll(filters),
    {
      staleTime: 2 * 60 * 1000, // 2 minutos (datos más dinámicos)
      placeholderData: (prev) => prev, // Mantiene datos anteriores durante carga
    }
  );
}

export function useFenomeno(id: number) {
  return useApi(
    ['fenomenos', String(id)],
    () => fenomenosApi.getById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
}

export function useFenomenosStats() {
  return useApi(
    'fenomenos-stats',
    () => fenomenosApi.getStats(),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
}
