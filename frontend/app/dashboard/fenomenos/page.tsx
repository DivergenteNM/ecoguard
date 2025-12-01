'use client';

import { useState, useMemo } from 'react';
import { AlertTriangle, TrendingUp, MapPin, Calendar, Flame, CloudRain, Wind, AlertCircle } from 'lucide-react';
import FenomenosList from '@/components/fenomenos/FenomenosList';
import FenomenosStats from '@/components/fenomenos/FenomenosStats';
import FenomenosTimeline from '@/components/fenomenos/FenomenosTimeline';
import FenomenosSeverityChart from '@/components/fenomenos/FenomenosSeverityChart';

type PeriodoFiltro = 'all' | '1year' | '6months' | '1month';

function calcularFechaInicio(periodo: PeriodoFiltro): string | undefined {
  if (periodo === 'all') return undefined;

  const fecha = new Date();
  switch (periodo) {
    case '1year':
      fecha.setFullYear(fecha.getFullYear() - 1);
      break;
    case '6months':
      fecha.setMonth(fecha.getMonth() - 6);
      break;
    case '1month':
      fecha.setMonth(fecha.getMonth() - 1);
      break;
  }
  return fecha.toISOString().split('T')[0];
}

export default function FenomenosPage() {
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('all');

  const fechaInicio = useMemo(() => calcularFechaInicio(periodo), [periodo]);

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={28} />
            Fenómenos Naturales
          </h2>
          <p className="text-slate-500">
            Registro histórico de eventos y fenómenos naturales en Nariño
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value as PeriodoFiltro)}
          >
            <option value="all">Todo el historial</option>
            <option value="1year">Último año</option>
            <option value="6months">Últimos 6 meses</option>
            <option value="1month">Último mes</option>
          </select>
        </div>
      </div>

      {/* Estadísticas principales */}
      <FenomenosStats fechaInicio={fechaInicio} />

      {/* Análisis temporal y severidad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FenomenosTimeline fechaInicio={fechaInicio} />
        <FenomenosSeverityChart fechaInicio={fechaInicio} />
      </div>

      {/* Lista de fenómenos */}
      <div className="mt-16">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Eventos Registrados</h3>
          <p className="text-sm text-slate-500">Historial completo de fenómenos naturales</p>
        </div>
        <FenomenosList />
      </div>
    </div>
  );
}
