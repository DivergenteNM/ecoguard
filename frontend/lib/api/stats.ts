import { apiClient } from './client';
import { DashboardStats, TimelineData, GranularidadType } from '../types/stats.types';

export const statsApi = {
  getDashboard: () =>
    apiClient.get<DashboardStats>('/api/stats/dashboard'),

  getTimeline: (granularidad: GranularidadType = 'mes', tipo?: string) =>
    apiClient.get<TimelineData>('/api/stats/timeline', { granularidad, tipo }),
};
