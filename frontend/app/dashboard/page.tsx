import { AlertTriangle, TrendingUp, Users, TreeDeciduous } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import MapPlaceholder from '@/components/dashboard/MapPlaceholder';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Resumen General</h2>
                    <p className="text-slate-500">Bienvenido de nuevo, aquí está el estado actual de Nariño.</p>
                </div>
                <div className="flex gap-3">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Alertas Activas"
                    value="12"
                    change="+2"
                    trend="up"
                    icon={AlertTriangle}
                    color="red"
                />
                <StatCard
                    title="Municipios en Riesgo"
                    value="8"
                    change="-1"
                    trend="down"
                    icon={Map}
                    color="amber"
                />
                <StatCard
                    title="Población Afectada"
                    value="14.5k"
                    change="+5%"
                    trend="up"
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Deforestación (Ha)"
                    value="1,240"
                    change="-12%"
                    trend="down"
                    icon={TreeDeciduous}
                    color="emerald"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Mapa de Riesgo en Tiempo Real</h3>
                        <MapPlaceholder />
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
}

// Helper for the Map icon in StatCard since we import Map from lucide-react which conflicts with Map component if we had one, 
// but here we are just passing the icon component.
// Actually I need to import Map from lucide-react in this file too for the icon.
import { Map } from 'lucide-react';
