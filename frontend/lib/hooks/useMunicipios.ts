import { useApi } from './useApi';
import { municipiosApi } from '../api/municipios';

export function useMunicipios(page = 1, limit = 100, nombre?: string) {
  return useApi(
    ['municipios', String(page), String(limit), nombre || ''],
    () => municipiosApi.getAll(page, limit, nombre),
    {
      staleTime: 5 * 60 * 1000, // 5 minutos
    }
  );
}

export function useMunicipio(id: number) {
  return useApi(
    ['municipios', String(id)],
    () => municipiosApi.getById(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutos
    }
  );
}

export function useMunicipiosStats() {
  return useApi(
    'municipios-stats',
    () => municipiosApi.getStats(),
    {
      staleTime: 10 * 60 * 1000,
    }
  );
}
