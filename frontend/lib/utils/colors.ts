import { ColorType } from '../types/common.types';

/**
 * Obtiene las clases de color para un tipo de color específico
 */
export function getColorClasses(color: ColorType): string {
  const colorMap: Record<ColorType, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
  };
  return colorMap[color] || colorMap.slate;
}

/**
 * Obtiene el color según el nivel de riesgo
 */
export function getRiskColor(nivel: string): ColorType {
  const lowerNivel = nivel.toLowerCase();
  if (lowerNivel.includes('alto') || lowerNivel.includes('crítico')) return 'red';
  if (lowerNivel.includes('medio') || lowerNivel.includes('moderado')) return 'amber';
  if (lowerNivel.includes('bajo')) return 'emerald';
  return 'slate';
}

/**
 * Obtiene el color para un tipo de fenómeno
 */
export function getFenomenoColor(tipo: string): ColorType {
  const lowerTipo = tipo.toLowerCase();
  if (lowerTipo.includes('deslizamiento')) return 'red';
  if (lowerTipo.includes('inundación') || lowerTipo.includes('avenida')) return 'blue';
  if (lowerTipo.includes('erosión') || lowerTipo.includes('socavación')) return 'amber';
  return 'slate';
}

/**
 * Genera un color basado en un hash de string (para categorías dinámicas)
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}
