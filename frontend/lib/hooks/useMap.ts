import { useApi } from './useApi';
import { mapApi, MapFilters } from '../api/map';

export function useMapFenomenos(filters?: MapFilters) {
  return useApi(
    ['map-fenomenos', JSON.stringify(filters || {})],
    () => mapApi.getFenomenosGeoJSON(filters),
    {
      staleTime: 2 * 60 * 1000,
      placeholderData: (prev) => prev,
    }
  );
}

export function useMapAmenazas() {
  return useApi(
    'map-amenazas',
    () => mapApi.getAmenazasGeoJSON(),
    {
      staleTime: 30 * 60 * 1000, // Datos más estáticos
    }
  );
}

export function useHeatmapData() {
  return useApi(
    'heatmap-data',
    () => mapApi.getHeatmapData(),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
}
