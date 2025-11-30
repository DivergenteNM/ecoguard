'use client';

import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { MAP_CONFIG } from '@/lib/utils/constants';
// @ts-ignore - Leaflet CSS doesn't have type definitions
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface InteractiveMapProps {
  fenomenosData?: any;
  amenazasData?: any;
  showFenomenos?: boolean;
  showAmenazas?: boolean;
  center?: [number, number];
  zoom?: number;
  onFeatureClick?: (feature: any) => void;
}

// Componente para manejar cambios de centro del mapa
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

export default function InteractiveMap({
  fenomenosData,
  amenazasData,
  showFenomenos = true,
  showAmenazas = true,
  center = MAP_CONFIG.CENTER,
  zoom = MAP_CONFIG.DEFAULT_ZOOM,
  onFeatureClick,
}: InteractiveMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-slate-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  // Estilos para marcadores de fenómenos según tipo
  const getFenomenoMarkerColor = (tipo: string) => {
    if (!tipo) return '#64748B'; // slate-500 por defecto
    const lowerTipo = tipo.toLowerCase();
    if (lowerTipo.includes('deslizamiento')) return '#DC2626'; // red-600
    if (lowerTipo.includes('inundación') || lowerTipo.includes('avenida')) return '#2563EB'; // blue-600
    if (lowerTipo.includes('erosión')) return '#D97706'; // amber-600
    return '#64748B'; // slate-500
  };

  const createFenomenoIcon = (tipo: string) => {
    const color = getFenomenoMarkerColor(tipo || '');
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
  };

  // Estilos para polígonos de amenazas
  const getAmenazaStyle = (feature: any) => {
    return {
      fillColor: '#F59E0B',
      weight: 2,
      opacity: 1,
      color: '#D97706',
      fillOpacity: 0.3,
    };
  };

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-slate-200">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapController center={center} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Capa de Fenómenos */}
        {showFenomenos && fenomenosData?.features && (
          <>
            {fenomenosData.features.map((feature: any) => {
              const [lng, lat] = feature.geometry.coordinates;
              const tipo = feature.properties?.tipo || feature.properties?.nombre || 'Marcador';
              return (
                <Marker
                  key={feature.properties.id}
                  position={[lat, lng]}
                  icon={createFenomenoIcon(tipo)}
                  eventHandlers={{
                    click: () => onFeatureClick?.(feature),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-sm">{tipo}</h3>
                      <p className="text-xs text-slate-600 mt-1">
                        {feature.properties.municipio || feature.properties.nombre}
                      </p>
                      {feature.properties.fecha && (
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(feature.properties.fecha).toLocaleDateString('es-CO')}
                        </p>
                      )}
                      {feature.properties.poblacion && (
                        <p className="text-xs text-slate-500 mt-1">
                          Población: {feature.properties.poblacion.toLocaleString('es-CO')}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </>
        )}

        {/* Capa de Amenazas */}
        {showAmenazas && amenazasData?.features && (
          <GeoJSON
            data={amenazasData}
            style={getAmenazaStyle}
            onEachFeature={(feature, layer) => {
              layer.on({
                click: () => onFeatureClick?.(feature),
              });
              layer.bindPopup(`
                <div class="p-2">
                  <h3 class="font-bold text-sm">${feature.properties.categoria}</h3>
                  <p class="text-xs text-slate-600 mt-1">${feature.properties.municipio || 'N/A'}</p>
                  ${feature.properties.areaKm2 ? `<p class="text-xs text-slate-500 mt-1">Área: ${feature.properties.areaKm2.toFixed(2)} km²</p>` : ''}
                </div>
              `);
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
