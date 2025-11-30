'use client';

import { Brain, Database, Target, TrendingUp, MapPin, Calendar, Layers } from 'lucide-react';

export default function ModelExplanation() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="text-blue-600" size={24} />
        <h3 className="font-bold text-slate-800 text-lg">¿Cómo funciona el Modelo de IA?</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Database className="text-emerald-600" size={20} />
            <h4 className="font-semibold text-slate-800 text-sm">Datos Históricos</h4>
          </div>
          <p className="text-xs text-slate-600">
            356 eventos reales de fenómenos naturales en Nariño desde 2012 (fuente: UNGRD)
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="text-purple-600" size={20} />
            <h4 className="font-semibold text-slate-800 text-sm">Algoritmo</h4>
          </div>
          <p className="text-xs text-slate-600">
            Random Forest con 200 árboles de decisión. Técnica robusta para clasificación de riesgos
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="text-orange-600" size={20} />
            <h4 className="font-semibold text-slate-800 text-sm">Variables Geo</h4>
          </div>
          <p className="text-xs text-slate-600">
            Coordenadas, distancia al centro, zona (costa, norte, sur, centro)
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-600" size={20} />
            <h4 className="font-semibold text-slate-800 text-sm">Variables Temporales</h4>
          </div>
          <p className="text-xs text-slate-600">
            Mes, trimestre, interacciones estacionales (patrones por época del año)
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-slate-800 text-sm mb-2 flex items-center gap-2">
          <Target className="text-red-600" size={18} />
          Tipos de Riesgo Detectados
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-md">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-slate-700">Deslizamientos</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-md">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-slate-700">Inundaciones</span>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-md">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            <span className="text-slate-700">Vendavales</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-md">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            <span className="text-slate-700">Incendios</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-md">
            <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
            <span className="text-slate-700">Sequías</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-md">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span className="text-slate-700">Sismos</span>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-blue-100 border border-blue-300 rounded-lg p-3">
        <p className="text-xs text-blue-900">
          <span className="font-semibold">💡 Importante:</span> Este modelo es una herramienta de apoyo basada en patrones históricos. 
          Las predicciones deben complementarse con análisis de expertos, monitoreo en tiempo real y evaluaciones específicas de cada zona. 
          La precisión actual del modelo es del 64%, y continúa mejorando con más datos.
        </p>
      </div>
    </div>
  );
}
