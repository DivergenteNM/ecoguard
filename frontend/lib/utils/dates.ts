import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha a formato legible
 */
export function formatDate(date: string | Date, formatString = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString, { locale: es });
}

/**
 * Formatea una fecha como tiempo relativo (ej: "hace 2 horas")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
}

/**
 * Formatea una fecha a formato ISO para APIs
 */
export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Obtiene el nombre del mes en español
 */
export function getMonthName(month: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[month - 1] || '';
}
