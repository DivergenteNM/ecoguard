import { Polygon } from './common.types';

export interface ZonaAmenaza {
  id: number;
  categoria: string;
  tipoFenomeno?: string;
  municipio?: string;
  areaKm2?: number;
  descripcion?: string;
  geom?: Polygon;
  created_at: string;
  updated_at: string;
}

export interface AmenazaStats {
  total: number;
  totalArea: number;
  porCategoria: {
    categoria: string;
    count: number;
  }[];
}
