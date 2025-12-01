'use client';

import { useState } from 'react';
import { AlertTriangle, TrendingUp, Shield, Activity, Brain, Zap } from 'lucide-react';
import AlertsList from '@/components/alerts/AlertsList';
import PredictionForm from '@/components/alerts/PredictionForm';
import ModelStats from '@/components/alerts/ModelStats';
import ModelExplanation from '@/components/alerts/ModelExplanation';
import ActiveAlertsMap from '@/components/alerts/ActiveAlertsMap';
import { useModelInfo } from '@/lib/hooks/usePredictions';

export default function AlertsPage() {
  const { data: modelInfo, isLoading: loadingModel } = useModelInfo();
  const [showPredictionForm, setShowPredictionForm] = useState(false);

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={28} />
            Sistema de Alertas Inteligente
          </h2>
          <p className="text-slate-500">
            Predicción y monitoreo de riesgos ambientales con IA
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowPredictionForm(!showPredictionForm)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors flex items-center gap-2"
          >
            <Brain size={18} />
            {showPredictionForm ? 'Ocultar Predictor' : 'Nueva Predicción IA'}
          </button>
        </div>
      </div>

      {/* Estadísticas del Modelo IA */}
      {!loadingModel && modelInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-linear-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-purple-100 text-sm mb-1">Precisión del Modelo</p>
                <p className="text-3xl font-bold mb-1">
                  {(modelInfo.performance.test_accuracy * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-purple-100">Datos de prueba</p>
              </div>
              <div className="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-blue-100 text-sm mb-1">Features Utilizadas</p>
                <p className="text-3xl font-bold mb-1">{modelInfo.features.total}</p>
                <p className="text-xs text-blue-100">Variables predictivas</p>
              </div>
              <div className="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
                <Activity size={24} />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-orange-100 text-sm mb-1">Tipos de Riesgo</p>
                <p className="text-3xl font-bold mb-1">{modelInfo.classes.total}</p>
                <p className="text-xs text-orange-100">Categorías detectadas</p>
              </div>
              <div className="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
                <Shield size={24} />
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-emerald-100 text-sm mb-1">Datos Entrenamiento</p>
                <p className="text-3xl font-bold mb-1">
                  {modelInfo.dataset.n_samples.toLocaleString()}
                </p>
                <p className="text-xs text-emerald-100">Registros históricos</p>
              </div>
              <div className="bg-emerald-400 bg-opacity-30 p-3 rounded-lg">
                <Zap size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de Predicción */}
      {showPredictionForm && (
        <div className="bg-linear-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200 shadow-lg">
          <PredictionForm />
        </div>
      )}

      {/* Mapa de Alertas Activas */}
      <ActiveAlertsMap />

      {/* Explicación del Modelo */}
      <ModelExplanation />

      {/* Estadísticas del Modelo */}
      <ModelStats modelInfo={modelInfo} isLoading={loadingModel} />

      {/* Lista de Alertas */}
      <div className="mt-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Alertas Activas</h3>
          <p className="text-sm text-slate-500">Predicciones y avisos de riesgo ambiental</p>
        </div>
        <AlertsList />
      </div>
    </div>
  );
}
