'use client';

import { ModelInfo } from '@/lib/types/predictions.types';
import { BarChart3, TrendingUp, Target, Database, Info } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

interface ModelStatsProps {
  modelInfo: ModelInfo | null | undefined;
  isLoading: boolean;
}

// Mapeo de nombres técnicos a nombres amigables
const FEATURE_NAMES: Record<string, string> = {
  'latitud': 'Latitud',
  'longitud': 'Longitud',
  'mes': 'Mes del año',
  'trimestre': 'Trimestre',
  'distancia_centro': 'Distancia al centro',
  'zona_encoded': 'Zona geográfica',
  'lat_mes': 'Interacción Lat-Mes',
  'lon_mes': 'Interacción Lon-Mes',
};

// Descripciones explicativas
const FEATURE_DESCRIPTIONS: Record<string, string> = {
  'latitud': 'Coordenada norte-sur. Mayor latitud indica zonas al norte de Nariño',
  'longitud': 'Coordenada este-oeste. Menor longitud indica zonas costeras (Pacífico)',
  'mes': 'Mes del año (1-12). Ciertos meses tienen mayor riesgo según históricos',
  'trimestre': 'Trimestre del año (1-4). Agrupa meses con patrones climáticos similares',
  'distancia_centro': 'Distancia al centro de Nariño (Pasto). Indica qué tan remota es la zona',
  'zona_encoded': 'Región: Costa Pacífica, Norte, Sur o Centro de Nariño',
  'lat_mes': 'Combinación de latitud y mes. Captura patrones estacionales por latitud',
  'lon_mes': 'Combinación de longitud y mes. Captura patrones estacionales por longitud',
};

export default function ModelStats({ modelInfo, isLoading }: ModelStatsProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!modelInfo) {
    return null;
  }

  const topFeatures = modelInfo.features.importance
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Features Más Importantes */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="text-purple-600" size={20} />
          <h3 className="font-bold text-slate-800">Variables Más Importantes</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Factores que el modelo considera para predecir riesgos
        </p>
        <div className="space-y-4">
          {topFeatures.map(({ feature, importance }) => (
            <div key={feature} className="group">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    {FEATURE_NAMES[feature] || feature}
                  </span>
                  <div className="relative group/tooltip">
                    <Info size={14} className="text-slate-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 w-64 z-10">
                      {FEATURE_DESCRIPTIONS[feature] || 'Variable utilizada en el análisis'}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-purple-600">
                  {(importance * 100).toFixed(1)}%
                </span>
              </div>
              <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-purple-400 to-purple-600 transition-all duration-500 rounded-full"
                  style={{ width: `${importance * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-xs text-purple-800">
            <span className="font-semibold">ℹ️ Modelo basado en datos reales:</span> Random Forest entrenado con {modelInfo.dataset.n_samples} registros históricos de fenómenos naturales en Nariño (UNGRD).
          </p>
        </div>
      </div>

      {/* Métricas de Rendimiento */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target className="text-emerald-600" size={20} />
          <h3 className="font-bold text-slate-800">Rendimiento del Modelo</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Métricas de evaluación y validación cruzada
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-emerald-700 font-medium">Precisión en Test</p>
                <p className="text-xs text-emerald-600">Datos no vistos</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-700">
              {(modelInfo.performance.test_accuracy * 100).toFixed(1)}%
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Target className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Validación Cruzada</p>
                <p className="text-xs text-blue-600">Promedio CV</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-700">
              {(modelInfo.performance.cv_accuracy_mean * 100).toFixed(1)}%
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Database className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-purple-700 font-medium">Precisión Entrenamiento</p>
                <p className="text-xs text-purple-600">Datos de entrenamiento</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-700">
              {(modelInfo.performance.train_accuracy * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-600">
            <span className="font-semibold">📊 Metodología:</span> El modelo utiliza Random Forest (200 árboles) con 8 variables geográficas y temporales. Se entrenó con {modelInfo.dataset.n_samples.toLocaleString()} eventos históricos y agrupa fenómenos similares (deslizamientos, inundaciones, vendavales, etc.) para mejorar precisión.
          </p>
        </div>
      </div>
    </div>
  );
}
