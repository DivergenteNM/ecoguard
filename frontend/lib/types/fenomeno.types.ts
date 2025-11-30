import { Point } from './common.types';

export interface Fenomeno {
  id: number;
  idFenomeno?: number;
  municipio: string;
  vereda?: string;
  latitud?: number;
  longitud?: number;
  alturaMsnm?: number;
  cuencaHidrografica?: string;
  tipoFenomenoOriginal?: string;
  tipoFenomenoNormalizado?: string;
  categoriaFenomeno?: string;
  nivelRiesgo?: string;
  numeroInforme?: string;
  fechaReporte?: string;
  año?: number;
  mes?: number;
  dia?: number;
  diasDesdeEvento?: number;
  urlReporte?: string;
  tieneReporte?: boolean;
  coordenadasValidas?: boolean;
  geom?: Point;
  createdAt: string;
  updatedAt: string;
}

export interface FenomenoStats {
  totalEventos: number;
  porTipo: {
    tipo: string;
    cantidad: number;
  }[];
  topMunicipios: {
    municipio: string;
    cantidad: number;
  }[];
}

export interface FenomenoFilters {
  tipo?: string;
  municipio?: string;
  fechaInicio?: string;
  fechaFin?: string;
  page?: number;
  limit?: number;
}
