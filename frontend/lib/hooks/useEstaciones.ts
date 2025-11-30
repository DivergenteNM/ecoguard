import { useApi } from './useApi';
import { estacionesApi } from '../api/estaciones';

export function useEstaciones() {
  return useApi(
    'estaciones',
    () => estacionesApi.getAll(),
    {
      staleTime: 30 * 60 * 1000, // 30 minutos (datos estáticos)
    }
  );
}

export function useEstacion(id: number) {
  return useApi(
    ['estaciones', String(id)],
    () => estacionesApi.getById(id),
    {
      enabled: !!id,
      staleTime: 30 * 60 * 1000,
    }
  );
}

export function useEstacionesStats() {
  return useApi(
    'estaciones-stats',
    () => estacionesApi.getStats(),
    {
      staleTime: 30 * 60 * 1000,
    }
  );
}
