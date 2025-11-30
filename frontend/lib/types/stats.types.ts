export interface DashboardStats {
  totalFenomenos: number;
  totalMunicipios: number;
  totalZonasAmenaza: number;
  fenomenosPorTipo: {
    tipo: string;
    count: number;
  }[];
  fenomenosPorMes: {
    mes: number;
    count: number;
  }[];
  municipiosMasAfectados: {
    nombre: string;
    count: number;
  }[];
  amenazasPorCategoria: {
    categoria: string;
    count: number;
  }[];
}

export interface TimelineData {
  timeline: {
    periodo: string;
    count: number;
  }[];
}

export type GranularidadType = 'mes' | 'trimestre' | 'año';
