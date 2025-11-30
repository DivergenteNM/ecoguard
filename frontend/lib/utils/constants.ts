/**
 * Constantes globales de la aplicación
 */

export const APP_NAME = 'EcoGuard';
export const APP_DESCRIPTION = 'Guardia Ambiental Nacional - Sistema de Monitoreo Ambiental de Nariño';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const MAP_CONFIG = {
  CENTER: [1.2136, -77.2811] as [number, number], // Pasto, Nariño
  DEFAULT_ZOOM: 9,
  MIN_ZOOM: 7,
  MAX_ZOOM: 18,
} as const;

export const FENOMENO_TYPES = [
  'DESLIZAMIENTO',
  'MOVIMIENTO EN MASA',
  'AVENIDA TORRENCIAL',
  'DESLIZAMIENTO ROTACIONAL',
  'DESLIZAMIENTO TRASLACIONAL',
  'PÉRDIDA DE BANCA',
  'DESLIZAMIENTO, AVENIDA TORRENCIAL',
  'INUNDACIÓN',
  'INUNDACIÓN Y/O AVENIDAS TORRENCIALES',
  'EROSIÓN',
  'SOCAVACIÓN',
] as const;

export const RISK_LEVELS = {
  BAJO: 'Bajo',
  MEDIO: 'Medio',
  ALTO: 'Alto',
  CRÍTICO: 'Crítico',
} as const;

export const GRANULARIDAD_OPTIONS = [
  { value: 'mes', label: 'Por Mes' },
  { value: 'trimestre', label: 'Por Trimestre' },
  { value: 'año', label: 'Por Año' },
] as const;

export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
] as const;
