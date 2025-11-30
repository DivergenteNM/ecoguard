import { apiClient } from './client';
import { Estacion, EstacionStats } from '../types/estacion.types';

export const estacionesApi = {
  getAll: () =>
    apiClient.get<Estacion[]>('/estaciones'),

  getById: (id: number) =>
    apiClient.get<Estacion>(`/estaciones/${id}`),

  getStats: () =>
    apiClient.get<EstacionStats>('/estaciones/stats'),
};
