import { apiClient } from './client';
import { GeoJSONFeatureCollection, HeatmapPoint } from '../types/common.types';

export interface MapFilters {
  tipo?: string;
  fechaInicio?: string;
  fechaFin?: string;
  municipio?: string;
}

export const mapApi = {
  getFenomenosGeoJSON: (filters?: MapFilters) =>
    apiClient.get<GeoJSONFeatureCollection>('/api/map/fenomenos', filters),

  getAmenazasGeoJSON: () =>
    apiClient.get<GeoJSONFeatureCollection>('/api/map/amenazas'),

  getHeatmapData: () =>
    apiClient.get<{ points: HeatmapPoint[] }>('/api/map/heatmap'),
};
