import { apiClient } from './client';
import { Fenomeno, FenomenoStats, FenomenoFilters } from '../types/fenomeno.types';
import { ApiResponse } from '../types/common.types';

export const fenomenosApi = {
  getAll: (filters?: FenomenoFilters) =>
    apiClient.get<ApiResponse<Fenomeno[]>>('/fenomenos', filters),

  getById: (id: number) =>
    apiClient.get<Fenomeno>(`/fenomenos/${id}`),

  getStats: () =>
    apiClient.get<FenomenoStats>('/fenomenos/stats'),
};
