'use client';

import { AlertTriangle, CloudRain, Droplets, Wind } from 'lucide-react';
import { useFenomenos } from '@/lib/hooks/useFenomenos';
import { formatRelativeTime } from '@/lib/utils/dates';
import { getFenomenoColor } from '@/lib/utils/colors';
import Skeleton from '@/components/ui/Skeleton';

const ActivityFeed = () => {
    const { data, isLoading } = useFenomenos({ page: 1, limit: 5 });

    // Iconos según tipo de fenómeno
    const getIcon = (tipo: string) => {
        const lowerTipo = tipo.toLowerCase();
        if (lowerTipo.includes('deslizamiento')) return AlertTriangle;
        if (lowerTipo.includes('inundación') || lowerTipo.includes('avenida')) return CloudRain;
        if (lowerTipo.includes('erosión') || lowerTipo.includes('socavación')) return Droplets;
        return Wind;
    };

    const getColorClass = (tipo: string) => {
        const color = getFenomenoColor(tipo);
        const colorMap: Record<string, string> = {
            red: 'text-red-500 bg-red-50',
            blue: 'text-blue-500 bg-blue-50',
            amber: 'text-amber-500 bg-amber-50',
            emerald: 'text-emerald-500 bg-emerald-50',
            slate: 'text-slate-500 bg-slate-50',
            orange: 'text-orange-500 bg-orange-50',
            yellow: 'text-yellow-600 bg-yellow-50',
            green: 'text-green-500 bg-green-50',
            purple: 'text-purple-500 bg-purple-50',
            pink: 'text-pink-500 bg-pink-50',
        };
        return colorMap[color] || colorMap.slate;
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full">
            <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Actividad Reciente</h3>
                <p className="text-xs text-slate-500 mt-1">Últimos fenómenos reportados</p>
            </div>
            <div className="p-6">
                {isLoading ? (
                    <div className="space-y-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : data && data.data.length > 0 ? (
                    <div className="space-y-6">
                        {data.data.map((fenomeno) => {
                            const Icon = getIcon(fenomeno.tipoFenomenoNormalizado || '');
                            return (
                                <div key={fenomeno.id} className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getColorClass(fenomeno.tipoFenomenoNormalizado || '')}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-800">
                                            {fenomeno.tipoFenomenoNormalizado || 'Fenómeno sin clasificar'}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{fenomeno.municipio}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {fenomeno.fechaReporte ? formatRelativeTime(fenomeno.fechaReporte) : 'Fecha no disponible'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-400">
                        <Wind size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No hay fenómenos recientes</p>
                    </div>
                )}
                <button className="w-full mt-6 py-2 text-sm text-emerald-600 font-medium hover:bg-emerald-50 rounded-lg transition-colors">
                    Ver todo el historial
                </button>
            </div>
        </div>
    );
};

export default ActivityFeed;
