import { apiClient } from './client';
import { Municipio, MunicipioStats } from '../types/municipio.types';
import { ApiResponse } from '../types/common.types';

export const municipiosApi = {
  getAll: (page = 1, limit = 100, nombre?: string) => {
    const params: any = { page, limit };
    if (nombre && nombre.trim()) {
      params.nombre = nombre.trim();
    }
    return apiClient.get<ApiResponse<Municipio[]>>('/municipios', params);
  },

  getById: (id: number) =>
    apiClient.get<Municipio>(`/municipios/${id}`),

  getStats: () =>
    apiClient.get<MunicipioStats>('/municipios/stats'),
};
