export interface PredictionRequest {
  latitud: number;
  longitud: number;
  mes: number;
  dia_semana?: number;
  precipitacion?: number;
}

export interface PredictionResponse {
  riesgo: string;
  probabilidad: number;
  top_3_predicciones: TopPrediction[];
  features_utilizadas: number;
  modelo_version: string;
  detalles: string;
}

export interface TopPrediction {
  riesgo: string;
  probabilidad: number;
}

export interface ModelInfo {
  features: {
    total: number;
    list: string[];
    importance: Record<string, number>;
  };
  classes: {
    total: number;
    list: string[];
    grouped: boolean;
  };
  performance: {
    test_accuracy: number;
    cv_accuracy_mean: number;
    cv_accuracy_std: number;
    train_accuracy: number;
  };
  dataset: {
    n_samples: number;
  };
}

export interface Alert {
  id: string;
  tipo: string;
  municipio: string;
  nivel: 'bajo' | 'medio' | 'alto' | 'critico';
  probabilidad: number;
  fecha: string;
  descripcion: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
  activa: boolean;
  acciones_recomendadas?: string[];
}

export type NivelRiesgo = 'bajo' | 'medio' | 'alto' | 'critico';

export interface RiskLevel {
  nivel: NivelRiesgo;
  color: string;
  bgColor: string;
  textColor: string;
  label: string;
}
