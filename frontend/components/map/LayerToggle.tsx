'use client';

import { Layers, Map as MapIcon, Zap } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LayerToggleProps {
  layers: {
    id: string;
    name: string;
    icon: React.ElementType;
    enabled: boolean;
    color: string;
  }[];
  onToggle: (layerId: string) => void;
}

export default function LayerToggle({ layers, onToggle }: LayerToggleProps) {
  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg border border-slate-200 p-3 w-56">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
        <Layers size={18} className="text-slate-600" />
        <h3 className="text-sm font-semibold text-slate-800">Capas del Mapa</h3>
      </div>
      
      <div className="space-y-2">
        {layers.map((layer) => {
          const Icon = layer.icon;
          return (
            <button
              key={layer.id}
              onClick={() => onToggle(layer.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left',
                layer.enabled
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
              )}
            >
              <div
                className={cn(
                  'w-4 h-4 rounded border-2 flex items-center justify-center',
                  layer.enabled
                    ? 'bg-emerald-600 border-emerald-600'
                    : 'border-slate-300'
                )}
              >
                {layer.enabled && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              
              <Icon size={16} className={layer.color} />
              
              <span
                className={cn(
                  'text-sm font-medium',
                  layer.enabled ? 'text-slate-800' : 'text-slate-500'
                )}
              >
                {layer.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
