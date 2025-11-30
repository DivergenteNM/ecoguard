'use client';

import { useState } from 'react';
import { Calendar, Loader2, CheckCircle, AlertCircle, Target } from 'lucide-react';
import dynamic from 'next/dynamic';
import { LatLng } from 'leaflet';
import { predictionsApi } from '@/lib/api/predictions';
import { RiskResult } from '@/lib/types/predictions.types';

// Cargar el mapa solo en el cliente
const MapSelector = dynamic(() => import('./MapSelector'), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] rounded-lg overflow-hidden border-2 border-purple-300 shadow-lg flex items-center justify-center bg-slate-100">
      <p className="text-slate-500">Cargando mapa...</p>
    </div>
  ),
});

export default function PredictionForm() {
  const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(null);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPosition) {
      setError('Por favor, selecciona una ubicación en el mapa');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await predictionsApi.calculateRisk({
        latitud: selectedPosition.lat,
        longitud: selectedPosition.lng,
        mes,
      });
      setResult(prediction);
    } catch (err) {
      setError('Error al realizar la predicción. Verifica que el servicio de IA esté activo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (probabilidad: number) => {
    if (probabilidad >= 0.7) return 'text-red-600 bg-red-50 border-red-200';
    if (probabilidad >= 0.5) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (probabilidad >= 0.3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  const getRiskIcon = (probabilidad: number) => {
    if (probabilidad >= 0.5) return <AlertCircle className="text-red-500" size={24} />;
    return <CheckCircle className="text-emerald-500" size={24} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-600 p-3 rounded-lg">
          <Target className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Predictor de Riesgo con IA</h3>
          <p className="text-sm text-slate-600">
            Haz clic en el mapa para seleccionar una ubicación en Nariño
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de Ubicación en Mapa */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            📍 Selecciona la ubicación en el mapa
          </label>
          <MapSelector 
            selectedPosition={selectedPosition} 
            setSelectedPosition={setSelectedPosition}
          />
          {selectedPosition && (
            <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200 text-sm">
              <p className="text-purple-800">
                <span className="font-semibold">Ubicación seleccionada:</span>
                {' '}Lat: {selectedPosition.lat.toFixed(4)}, Lng: {selectedPosition.lng.toFixed(4)}
              </p>
            </div>
          )}
        </div>

        {/* Selector de Mes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            📅 Selecciona el mes para la predicción
          </label>
          <select
            value={mes}
            onChange={(e) => setMes(parseInt(e.target.value))}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
            required
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2024, m - 1).toLocaleDateString('es', { month: 'long' }).toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedPosition}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium rounded-lg px-6 py-3 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analizando con IA...
            </>
          ) : (
            <>
              <Calendar size={20} />
              Predecir Riesgo
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-red-800">Error en la predicción</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className={`border-2 rounded-xl p-6 ${getRiskColor(result.probabilidad)}`}>
            <div className="flex items-start gap-4">
              {getRiskIcon(result.probabilidad)}
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">Resultado de la Predicción</h4>
                <p className="text-2xl font-bold mb-2">{result.riesgo}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 bg-white bg-opacity-50 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-current transition-all duration-500"
                      style={{ width: `${result.probabilidad * 100}%` }}
                    />
                  </div>
                  <span className="font-bold text-sm">
                    {(result.probabilidad * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm opacity-90">{result.detalles}</p>
              </div>
            </div>
          </div>

          {result.top_3_predicciones && result.top_3_predicciones.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h5 className="font-semibold text-slate-800 mb-4">Top 3 Predicciones Alternativas</h5>
              <div className="space-y-3">
                {result.top_3_predicciones.map((pred, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="bg-slate-100 text-slate-700 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-slate-700">{pred.riesgo}</span>
                        <span className="text-sm font-semibold text-slate-600">
                          {(pred.probabilidad * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
                          style={{ width: `${pred.probabilidad * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

