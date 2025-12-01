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
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    pink: 'bg-pink-50 text-pink-600 border-pink-100',
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
  
  // Deslizamientos (rojo) - Mayor riesgo
  if (lowerTipo.includes('deslizamiento') && !lowerTipo.includes('rotacional') && !lowerTipo.includes('traslacional')) return 'red';
  
  // Movimiento en masa (naranja)
  if (lowerTipo.includes('movimiento en masa') || lowerTipo.includes('movimiento de masa')) return 'orange';
  
  // Avenida torrencial (amarillo)
  if (lowerTipo.includes('avenida torrencial') || lowerTipo.includes('avenida')) return 'yellow';
  
  // Deslizamiento rotacional (verde)
  if (lowerTipo.includes('rotacional')) return 'green';
  
  // Deslizamiento traslacional (azul)
  if (lowerTipo.includes('traslacional')) return 'blue';
  
  // Pérdida de banca (púrpura)
  if (lowerTipo.includes('pérdida') || lowerTipo.includes('perdida') || lowerTipo.includes('banca')) return 'purple';
  
  // Inundación (azul)
  if (lowerTipo.includes('inundación') || lowerTipo.includes('inundacion')) return 'blue';
  
  // Erosión/Socavación (ámbar)
  if (lowerTipo.includes('erosión') || lowerTipo.includes('erosion') || lowerTipo.includes('socavación') || lowerTipo.includes('socavacion')) return 'amber';
  
  return 'slate';
}

/**
 * Obtiene la etiqueta descriptiva para un tipo de fenómeno
 */
export function getFenomenoLabel(tipo: string): string {
  const lowerTipo = tipo.toLowerCase();
  
  if (lowerTipo.includes('deslizamiento') && lowerTipo.includes('rotacional')) return 'Rotacional';
  if (lowerTipo.includes('deslizamiento') && lowerTipo.includes('traslacional')) return 'Traslacional';
  if (lowerTipo.includes('deslizamiento')) return 'Deslizamiento';
  if (lowerTipo.includes('movimiento en masa') || lowerTipo.includes('movimiento de masa')) return 'Mov. Masa';
  if (lowerTipo.includes('avenida torrencial')) return 'Av. Torrencial';
  if (lowerTipo.includes('avenida')) return 'Avenida';
  if (lowerTipo.includes('pérdida') || lowerTipo.includes('perdida') || lowerTipo.includes('banca')) return 'Pérdida Banca';
  if (lowerTipo.includes('inundación') || lowerTipo.includes('inundacion')) return 'Inundación';
  if (lowerTipo.includes('erosión') || lowerTipo.includes('erosion')) return 'Erosión';
  if (lowerTipo.includes('socavación') || lowerTipo.includes('socavacion')) return 'Socavación';
  
  return 'Otro';
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
