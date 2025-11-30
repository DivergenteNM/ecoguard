import { Point } from './common.types';

export interface Estacion {
  id: number;
  codigo: string;
  nombre: string;
  tipoEstacion?: string;
  tecnologia?: string;
  departamento: string;
  municipio: string;
  zonaHidrografica?: string;
  latitud?: number;
  longitud?: number;
  entidad?: string;
  estado?: string;
  geom?: Point;
  created_at: string;
  updated_at: string;
}

export interface EstacionStats {
  total: number;
  tiposPorEstacion?: Record<string, number>;
}
