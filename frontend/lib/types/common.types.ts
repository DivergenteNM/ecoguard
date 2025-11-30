// Tipos comunes usados en toda la aplicación

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export type TrendType = 'up' | 'down' | 'neutral';

export type ColorType = 'emerald' | 'blue' | 'amber' | 'red' | 'slate';

export interface Point {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoJSONFeature<T = any> {
  type: 'Feature';
  geometry: Point | Polygon;
  properties: T;
}

export interface GeoJSONFeatureCollection<T = any> {
  type: 'FeatureCollection';
  features: GeoJSONFeature<T>[];
}

export interface Polygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface HeatmapPoint {
  lat: number;
  lon: number;
  weight: number;
}
