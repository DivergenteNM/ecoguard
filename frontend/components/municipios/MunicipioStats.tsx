'use client';

import { useMemo } from 'react';
import { Municipio } from '@/lib/types/municipio.types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Users, TrendingUp, MapPin, AlertTriangle } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatters';
import BarChart from '@/components/charts/BarChart';

interface MunicipioStatsProps {
  municipios: Municipio[];
}

export default function MunicipioStats({ municipios }: MunicipioStatsProps) {
  const stats = useMemo(() => {
    const totalPoblacion = municipios.reduce((sum, m) => sum + (m.poblacionTotal || m.poblacion || 0), 0);
    const conPoblacion = municipios.filter(m => m.poblacionTotal || m.poblacion);
    const promedioPoblacion = conPoblacion.length > 0 ? totalPoblacion / conPoblacion.length : 0;

    const masGrandes = municipios
      .filter(m => m.poblacionTotal || m.poblacion)
      .sort((a, b) => (b.poblacionTotal || b.poblacion || 0) - (a.poblacionTotal || a.poblacion || 0))
      .slice(0, 10);

    return {
      total: municipios.length,
      totalPoblacion,
      promedioPoblacion,
      masGrandes,
    };
  }, [municipios]);

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <MapPin className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Municipios</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <Users className="text-emerald-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Población Total</p>
                <p className="text-2xl font-bold text-slate-800">{formatNumber(stats.totalPoblacion)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <TrendingUp className="text-amber-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Promedio Población</p>
                <p className="text-2xl font-bold text-slate-800">{formatNumber(Math.round(stats.promedioPoblacion))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de municipios más poblados */}
      {stats.masGrandes.length > 0 && (
        <BarChart
          title="Municipios Más Poblados"
          labels={stats.masGrandes.map(m => m.nombre)}
          data={stats.masGrandes.map(m => m.poblacionTotal || m.poblacion || 0)}
          color="#2563EB"
          height={450}
        />
      )}
    </div>
  );
}
