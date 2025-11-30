'use client';

import { AlertTriangle, Shield, Flame } from 'lucide-react';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import LayerToggle from '@/components/map/LayerToggle';
import MapFilters, { MapFiltersState } from '@/components/map/MapFilters';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/Spinner';
import { useMapFenomenos, useMapAmenazas } from '@/lib/hooks/useMap';
import { useMunicipios } from '@/lib/hooks/useMunicipios';
import { formatNumber } from '@/lib/utils/formatters';

// Importación dinámica del mapa para evitar SSR
const InteractiveMap = dynamic(() => import('@/components/map/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-slate-100 rounded-xl flex items-center justify-center">
      <LoadingOverlay message="Cargando mapa..." />
    </div>
  ),
});

export default function MapPage() {
  const [filters, setFilters] = useState<MapFiltersState>({});
  const [layers, setLayers] = useState([
    { id: 'fenomenos', name: 'Fenómenos', icon: AlertTriangle, enabled: true, color: 'text-red-600' },
    { id: 'amenazas', name: 'Amenazas', icon: Shield, enabled: true, color: 'text-amber-600' },
  ]);

  const { data: fenomenosGeo, isLoading: loadingFenomenos } = useMapFenomenos(filters);
  const { data: amenazasGeo, isLoading: loadingAmenazas } = useMapAmenazas();
  const { data: municipiosData } = useMunicipios(1, 100);

  const municipios = useMemo(() => {
    return municipiosData?.data.map(m => m.nombre).sort() || [];
  }, [municipiosData]);

  const handleLayerToggle = (layerId: string) => {
    setLayers(layers.map(layer =>
      layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
    ));
  };

  const fenomenosLayer = layers.find(l => l.id === 'fenomenos');
  const amenazasLayer = layers.find(l => l.id === 'amenazas');

  const isLoading = loadingFenomenos || loadingAmenazas;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Mapa de Riesgos</h2>
          <p className="text-slate-500">Visualización geoespacial de fenómenos y zonas de amenaza</p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Fenómenos Visibles</p>
                <p className="text-2xl font-bold text-slate-800">
                  {fenomenosGeo?.features?.length ? formatNumber(fenomenosGeo.features.length) : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <Shield className="text-amber-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Zonas de Amenaza</p>
                <p className="text-2xl font-bold text-slate-800">
                  {amenazasGeo?.features?.length ? formatNumber(amenazasGeo.features.length) : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Flame className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Municipios</p>
                <p className="text-2xl font-bold text-slate-800">
                  {municipiosData?.meta?.total || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mapa */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="h-[600px] flex items-center justify-center">
              <LoadingOverlay message="Cargando datos del mapa..." />
            </div>
          ) : (
            <div className="relative">
              <MapFilters
                filters={filters}
                onFiltersChange={setFilters}
                municipios={municipios}
              />
              
              <LayerToggle
                layers={layers}
                onToggle={handleLayerToggle}
              />
              
              <InteractiveMap
                fenomenosData={fenomenosLayer?.enabled ? fenomenosGeo : undefined}
                amenazasData={amenazasLayer?.enabled ? amenazasGeo : undefined}
                showFenomenos={fenomenosLayer?.enabled}
                showAmenazas={amenazasLayer?.enabled}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leyenda */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-slate-800">Leyenda</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Fenómenos Naturales</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span className="text-sm text-slate-600">Deslizamientos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-slate-600">Inundaciones / Avenidas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                  <span className="text-sm text-slate-600">Erosión / Socavación</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                  <span className="text-sm text-slate-600">Otros fenómenos</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Zonas de Amenaza</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-3 bg-amber-500 opacity-30 border-2 border-amber-700"></div>
                  <span className="text-sm text-slate-600">Áreas con susceptibilidad</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
