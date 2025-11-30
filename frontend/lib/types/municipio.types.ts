import { Point } from './common.types';

export interface Municipio {
  id: number;
  codigo: string;
  nombre: string;
  departamento: string;
  poblacion?: number;
  poblacionTotal?: number;
  anio_poblacion?: number;
  geom?: Point;
  created_at: string;
  updated_at: string;
}

export interface MunicipioStats {
  total: number;
  promedios?: {
    poblacion?: number;
  };
  extremos?: {
    maxPoblacion?: {
      municipio: string;
      poblacion: number;
    };
    minPoblacion?: {
      municipio: string;
      poblacion: number;
    };
  };
}
