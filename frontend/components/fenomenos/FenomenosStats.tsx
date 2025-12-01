'use client';

import { useFenomenos } from '@/lib/hooks/useFenomenos';
import { AlertTriangle, TrendingUp, MapPin, Calendar } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

interface FenomenosStatsProps {
  fechaInicio?: string;
}

export default function FenomenosStats({ fechaInicio }: FenomenosStatsProps) {
  const { data, isLoading } = useFenomenos({ page: 1, limit: 1000, fechaInicio }); // Obtener todos para estadísticas

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const fenomenos = data?.data || [];
  
  // Calcular estadísticas
  const totalFenomenos = fenomenos.length;
  const tiposUnicos = new Set(
    fenomenos
      .map(f => f.tipoFenomenoNormalizado || f.tipoFenomenoOriginal)
      .filter(Boolean)
  ).size;
  const municipiosAfectados = new Set(fenomenos.map(f => f.municipio)).size;
  
  // Fenómenos recientes (últimos 30 días)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const fenomenosRecientes = fenomenos.filter(f => {
    if (!f.fechaReporte) return false;
    const fechaEvento = new Date(f.fechaReporte);
    return !isNaN(fechaEvento.getTime()) && fechaEvento >= thirtyDaysAgo;
  }).length;

  const stats = [
    {
      icon: AlertTriangle,
      label: 'Total de Eventos',
      value: totalFenomenos.toString(),
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      icon: Calendar,
      label: 'Eventos Recientes',
      value: fenomenosRecientes.toString(),
      subtitle: 'Últimos 30 días',
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      icon: TrendingUp,
      label: 'Tipos de Fenómenos',
      value: tiposUnicos.toString(),
      subtitle: 'Categorías distintas',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: MapPin,
      label: 'Municipios Afectados',
      value: municipiosAfectados.toString(),
      subtitle: 'Con registros',
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-xs text-slate-500">{stat.subtitle}</p>
              )}
            </div>
            <div className={`${stat.bgColor} p-3 rounded-lg`}>
              <stat.icon className={`${stat.iconColor}`} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
