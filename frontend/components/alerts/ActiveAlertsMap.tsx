import dynamic from 'next/dynamic';
import { AlertTriangle } from 'lucide-react';

const AlertsMapContent = dynamic(() => import('./AlertsMapContent'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-lg border border-slate-200 flex items-center justify-center bg-slate-50">
      <div className="text-slate-500">Cargando mapa...</div>
    </div>
  ),
});

export default function ActiveAlertsMap() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-600" size={20} />
          <h3 className="font-bold text-slate-800">Mapa de Alertas Activas</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <span className="w-3 h-3 bg-red-600 rounded-full"></span>
            Crítico
          </span>
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <span className="w-3 h-3 bg-orange-600 rounded-full"></span>
            Alto
          </span>
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-600 rounded-full"></span>
            Medio
          </span>
        </div>
      </div>

      <AlertsMapContent />

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">💡 Tip:</span> Haz clic en los marcadores para ver detalles de cada alerta. El radio del círculo indica la probabilidad del riesgo.
        </p>
      </div>
    </div>
  );
}

