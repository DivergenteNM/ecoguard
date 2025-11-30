'use client';

import { AlertTriangle, Clock, MapPin, TrendingUp } from 'lucide-react';

// Datos de ejemplo - en producción vendrían de la API
const MOCK_ALERTS = [
  {
    id: '1',
    tipo: 'INUNDACIÓN',
    municipio: 'Tumaco',
    nivel: 'alto' as const,
    probabilidad: 0.85,
    fecha: new Date().toISOString(),
    descripcion: 'Alta probabilidad de inundación detectada por el modelo IA',
    coordenadas: { lat: 1.8, lng: -78.8 },
    activa: true,
    acciones_recomendadas: [
      'Evacuar zonas bajas cercanas a ríos',
      'Preparar kit de emergencia',
      'Mantenerse informado sobre niveles de agua'
    ],
  },
  {
    id: '2',
    tipo: 'DESLIZAMIENTO',
    municipio: 'Pasto',
    nivel: 'medio' as const,
    probabilidad: 0.62,
    fecha: new Date(Date.now() - 3600000).toISOString(),
    descripcion: 'Riesgo moderado de deslizamiento en zonas de pendiente',
    coordenadas: { lat: 1.21, lng: -77.28 },
    activa: true,
    acciones_recomendadas: [
      'Monitorear grietas en terreno',
      'Evitar construcciones en zonas de riesgo'
    ],
  },
  {
    id: '3',
    tipo: 'AVENIDA TORRENCIAL',
    municipio: 'Ipiales',
    nivel: 'critico' as const,
    probabilidad: 0.92,
    fecha: new Date(Date.now() - 7200000).toISOString(),
    descripcion: 'Riesgo crítico de avenida torrencial por precipitaciones intensas',
    coordenadas: { lat: 0.83, lng: -77.64 },
    activa: true,
    acciones_recomendadas: [
      'Evacuación inmediata de zonas cercanas a cauces',
      'Activar protocolos de emergencia',
      'Coordinar con autoridades locales'
    ],
  },
];

export default function AlertsList() {
  const getLevelColor = (nivel: string) => {
    switch (nivel) {
      case 'critico':
        return 'bg-red-50 border-red-300 text-red-800';
      case 'alto':
        return 'bg-orange-50 border-orange-300 text-orange-800';
      case 'medio':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      case 'bajo':
        return 'bg-emerald-50 border-emerald-300 text-emerald-800';
      default:
        return 'bg-slate-50 border-slate-300 text-slate-800';
    }
  };

  const getLevelBadge = (nivel: string) => {
    switch (nivel) {
      case 'critico':
        return 'bg-red-600 text-white';
      case 'alto':
        return 'bg-orange-600 text-white';
      case 'medio':
        return 'bg-yellow-600 text-white';
      case 'bajo':
        return 'bg-emerald-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 60) {
      return `Hace ${minutes} minutos`;
    }
    if (hours < 24) {
      return `Hace ${hours} horas`;
    }
    return date.toLocaleDateString('es', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {MOCK_ALERTS.map((alert) => (
        <div
          key={alert.id}
          className={`border-2 rounded-xl p-6 transition-all hover:shadow-lg ${getLevelColor(alert.nivel)}`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${alert.nivel === 'critico' ? 'bg-red-600' : alert.nivel === 'alto' ? 'bg-orange-600' : 'bg-yellow-600'}`}>
                <AlertTriangle className="text-white" size={24} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold">{alert.tipo}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getLevelBadge(alert.nivel)}`}>
                      {alert.nivel}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm opacity-80">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {alert.municipio}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatDate(alert.fecha)}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-semibold mb-1">
                    <TrendingUp size={16} />
                    {(alert.probabilidad * 100).toFixed(0)}%
                  </div>
                  <div className="w-20 h-2 bg-white bg-opacity-50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-current transition-all"
                      style={{ width: `${alert.probabilidad * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-sm mb-4 opacity-90">{alert.descripcion}</p>

              {alert.acciones_recomendadas && alert.acciones_recomendadas.length > 0 && (
                <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-current border-opacity-20">
                  <h4 className="font-semibold text-sm mb-2">Acciones Recomendadas:</h4>
                  <ul className="space-y-1">
                    {alert.acciones_recomendadas.map((accion, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-current">•</span>
                        <span>{accion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {MOCK_ALERTS.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-emerald-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            No hay alertas activas
          </h3>
          <p className="text-slate-500">
            El sistema está monitoreando continuamente. Las alertas aparecerán aquí.
          </p>
        </div>
      )}
    </div>
  );
}
