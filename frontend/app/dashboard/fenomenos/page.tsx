'use client';

import { AlertTriangle, TrendingUp, MapPin, Calendar, Flame, CloudRain, Wind, AlertCircle } from 'lucide-react';
import FenomenosList from '@/components/fenomenos/FenomenosList';
import FenomenosStats from '@/components/fenomenos/FenomenosStats';
import FenomenosTimeline from '@/components/fenomenos/FenomenosTimeline';
import FenomenosSeverityChart from '@/components/fenomenos/FenomenosSeverityChart';

export default function FenomenosPage() {
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
          <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5">
            <option>Todo el historial</option>
            <option>Último año</option>
            <option>Últimos 6 meses</option>
            <option>Último mes</option>
          </select>
        </div>
      </div>

      {/* Estadísticas principales */}
      <FenomenosStats />

      {/* Análisis temporal y severidad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FenomenosTimeline />
        <FenomenosSeverityChart />
      </div>

      {/* Lista de fenómenos */}
      <div className="mt-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Eventos Registrados</h3>
          <p className="text-sm text-slate-500">Historial completo de fenómenos naturales</p>
        </div>
        <FenomenosList />
      </div>
    </div>
  );
}
