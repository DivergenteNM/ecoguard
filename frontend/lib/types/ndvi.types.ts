export interface NDVIData {
  municipio: string;
  ndviPromedio: number;
  ndviMin: number;
  ndviMax: number;
  areaKm2: number;
}

export interface NDVIPeriodo {
  inicio: string;
  fin: string;
}

export interface NDVIRegistro {
  id: number;
  periodo: NDVIPeriodo;
  datos: NDVIData[];
  fechaExtraccion: string;
  created_at: string;
  updated_at: string;
}

export interface NDVIStats {
  total: number;
  ultimaExtraccion: string;
  rangoNDVI: {
    min: number;
    max: number;
    promedio: number;
  };
}
