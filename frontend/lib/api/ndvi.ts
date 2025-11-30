import { apiClient } from './client';
import { NDVIRegistro, NDVIStats } from '../types/ndvi.types';

export const ndviApi = {
  getLatest: () =>
    apiClient.get<NDVIRegistro>('/ndvi/latest'),

  getAll: () =>
    apiClient.get<NDVIRegistro[]>('/ndvi'),

  getStats: () =>
    apiClient.get<NDVIStats>('/ndvi/stats'),
};
