'use client';

import { AlertTriangle, Map, Users, TreeDeciduous } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import { useDashboardStats } from '@/lib/hooks/useStats';
import { useMapFenomenos, useMapAmenazas } from '@/lib/hooks/useMap';
import { StatCardSkeleton } from '@/components/ui/Skeleton';
import { LoadingOverlay } from '@/components/ui/Spinner';
import { formatNumber, abbreviateNumber } from '@/lib/utils/formatters';

// Importación dinámica del mapa para evitar SSR
const InteractiveMap = dynamic(() => import('@/components/map/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-slate-100 rounded-lg flex items-center justify-center">
      <LoadingOverlay message="Cargando mapa..." />
    </div>
  ),
});

export default function DashboardPage() {
    const { data: stats, isLoading, error } = useDashboardStats();
    const { data: fenomenosGeo, isLoading: loadingFenomenos } = useMapFenomenos();
    const { data: amenazasGeo, isLoading: loadingAmenazas } = useMapAmenazas();

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Error al cargar datos</h3>
                    <p className="text-slate-500">No se pudieron cargar las estadísticas del dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Resumen General</h2>
                    <p className="text-slate-500">Bienvenido de nuevo, aquí está el estado actual de Nariño.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5">
                        <option>Últimos 7 días</option>
                        <option>Último mes</option>
                        <option>Este año</option>
                    </select>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors">
                        Generar Reporte
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {isLoading ? (
                    <>
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                        <StatCardSkeleton />
                    </>
                ) : (
                    <>
                        <StatCard
                            title="Total Fenómenos"
                            value={stats ? formatNumber(stats.totalFenomenos) : '0'}
                            icon={AlertTriangle}
                            color="red"
                        />
                        <StatCard
                            title="Municipios Registrados"
                            value={stats ? stats.totalMunicipios.toString() : '0'}
                            icon={Map}
                            color="blue"
                        />
                        <StatCard
                            title="Zonas de Amenaza"
                            value={stats ? abbreviateNumber(stats.totalZonasAmenaza) : '0'}
                            icon={Users}
                            color="amber"
                        />
                        <StatCard
                            title="Municipios con Mayor Riesgo"
                            value={stats?.municipiosMasAfectados?.[0]?.nombre || 'N/A'}
                            change={stats?.municipiosMasAfectados?.[0]?.count ? `${stats.municipiosMasAfectados[0].count} eventos` : undefined}
                            icon={TreeDeciduous}
                            color="emerald"
                        />
                    </>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800">Mapa de Riesgo en Tiempo Real</h3>
                            <Link 
                                href="/dashboard/map" 
                                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                Ver mapa completo →
                            </Link>
                        </div>
                        {loadingFenomenos || loadingAmenazas ? (
                            <div className="w-full h-[400px] bg-slate-100 rounded-lg flex items-center justify-center">
                                <LoadingOverlay message="Cargando mapa..." />
                            </div>
                        ) : (
                            <div className="h-[600px]">
                            <InteractiveMap
                                fenomenosData={fenomenosGeo}
                                amenazasData={amenazasGeo}
                                showFenomenos={true}
                                showAmenazas={true}
                                zoom={8}
                            />
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <ActivityFeed />
                </div>
            </div>

            {/* Gráficos de estadísticas */}
            {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* Municipios más afectados */}
                    {stats.municipiosMasAfectados && stats.municipiosMasAfectados.length > 0 && (
                        <BarChart
                            title="Municipios Más Afectados"
                            labels={stats.municipiosMasAfectados.map(m => m.nombre)}
                            data={stats.municipiosMasAfectados.map(m => m.count)}
                            color="#DC2626"
                        />
                    )}

                    {/* Fenómenos por tipo */}
                    {stats.fenomenosPorTipo && stats.fenomenosPorTipo.length > 0 && (
                        <PieChart
                            title="Distribución de Fenómenos por Tipo"
                            labels={stats.fenomenosPorTipo.map(f => f.tipo)}
                            data={stats.fenomenosPorTipo.map(f => f.count)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
