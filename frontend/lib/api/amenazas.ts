import { apiClient } from './client';
import { ZonaAmenaza, AmenazaStats } from '../types/amenaza.types';
import { ApiResponse } from '../types/common.types';

export const amenazasApi = {
  getAll: (page = 1, limit = 100) =>
    apiClient.get<ApiResponse<ZonaAmenaza[]>>('/amenazas', { page, limit }),

  getById: (id: number) =>
    apiClient.get<ZonaAmenaza>(`/amenazas/${id}`),

  getStats: () =>
    apiClient.get<AmenazaStats>('/amenazas/stats'),
};
