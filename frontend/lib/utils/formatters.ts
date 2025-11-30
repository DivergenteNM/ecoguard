/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-CO').format(value);
}

/**
 * Formatea un número a formato de moneda
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Formatea un número a porcentaje
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Abrevia números grandes (ej: 1500 -> "1.5k")
 */
export function abbreviateNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
}

/**
 * Formatea coordenadas geográficas
 */
export function formatCoordinate(value: number, type: 'lat' | 'lon'): string {
  const abs = Math.abs(value);
  const direction = type === 'lat' 
    ? (value >= 0 ? 'N' : 'S')
    : (value >= 0 ? 'E' : 'W');
  return `${abs.toFixed(6)}° ${direction}`;
}

/**
 * Formatea área en km²
 */
export function formatArea(value: number): string {
  return `${formatNumber(value)} km²`;
}
