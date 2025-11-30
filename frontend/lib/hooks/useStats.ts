import { useApi, useApiMutation } from './useApi';
import { statsApi } from '../api/stats';
import { GranularidadType } from '../types/stats.types';

export function useDashboardStats() {
  return useApi(
    'dashboard-stats',
    () => statsApi.getDashboard(),
    {
      staleTime: 2 * 60 * 1000, // 2 minutos
      refetchOnWindowFocus: true, // Refresca al volver a la ventana
    }
  );
}

export function useTimeline(granularidad: GranularidadType = 'mes', tipo?: string) {
  return useApi(
    ['timeline', granularidad, tipo || ''],
    () => statsApi.getTimeline(granularidad, tipo),
    {
      staleTime: 5 * 60 * 1000,
      placeholderData: (prev) => prev,
    }
  );
}
