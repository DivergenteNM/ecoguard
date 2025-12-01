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
    if (lowerTipo.includes('deslizamiento') && !lowerTipo.includes('rotacional') && !lowerTipo.includes('traslacional')) return '#DC2626'; // red-600
    if (lowerTipo.includes('movimiento en masa') || lowerTipo.includes('movimiento de masa')) return '#EA580C'; // orange-600
    if (lowerTipo.includes('avenida torrencial') || lowerTipo.includes('avenida')) return '#CA8A04'; // yellow-600
    if (lowerTipo.includes('rotacional')) return '#16A34A'; // green-600
    if (lowerTipo.includes('traslacional')) return '#2563EB'; // blue-600
    if (lowerTipo.includes('inundación') || lowerTipo.includes('inundacion')) return '#2563EB'; // blue-600
    if (lowerTipo.includes('pérdida') || lowerTipo.includes('perdida') || lowerTipo.includes('banca')) return '#9333EA'; // purple-600
    if (lowerTipo.includes('erosión') || lowerTipo.includes('erosion') || lowerTipo.includes('socavación')) return '#D97706'; // amber-600
    return '#64748B'; // slate-500
  };

  // Obtener icono SVG según tipo de fenómeno
  const getFenomenoIconSvg = (tipo: string) => {
    const lowerTipo = (tipo || '').toLowerCase();
    
    // Deslizamiento - Icono de montaña con flecha hacia abajo
    if (lowerTipo.includes('deslizamiento') || lowerTipo.includes('rotacional') || lowerTipo.includes('traslacional')) {
      return `<path d="M12 2L2 19h20L12 2zm0 3l7 12H5l7-12z" fill="white"/><path d="M12 10v4m0 2v.01" stroke="white" stroke-width="2" stroke-linecap="round"/>`;
    }
    
    // Movimiento en masa - Icono de rocas cayendo
    if (lowerTipo.includes('movimiento en masa') || lowerTipo.includes('movimiento de masa')) {
      return `<circle cx="8" cy="10" r="3" fill="white"/><circle cx="14" cy="8" r="2" fill="white"/><circle cx="12" cy="14" r="2.5" fill="white"/><path d="M6 18l4-4 4 4 4-4" stroke="white" stroke-width="1.5" fill="none"/>`;
    }
    
    // Avenida torrencial / Inundación - Icono de olas
    if (lowerTipo.includes('avenida') || lowerTipo.includes('inundación') || lowerTipo.includes('inundacion')) {
      return `<path d="M4 12c1.5-1.5 3-1.5 4 0s2.5 1.5 4 0 2.5-1.5 4 0 2.5 1.5 4 0" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M4 16c1.5-1.5 3-1.5 4 0s2.5 1.5 4 0 2.5-1.5 4 0 2.5 1.5 4 0" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M4 8c1.5-1.5 3-1.5 4 0s2.5 1.5 4 0 2.5-1.5 4 0 2.5 1.5 4 0" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    }
    
    // Erosión/Socavación - Icono de grieta
    if (lowerTipo.includes('erosión') || lowerTipo.includes('erosion') || lowerTipo.includes('socavación')) {
      return `<path d="M12 4v3m0 2v3m0 2v3m0 2v1M8 7l4 3-4 3 4 3-4 3" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    
    // Pérdida de banca - Icono de carretera rota
    if (lowerTipo.includes('pérdida') || lowerTipo.includes('perdida') || lowerTipo.includes('banca')) {
      return `<path d="M4 6h6l2 4-2 4H4M14 6h6v12h-6l2-4-2-4z" stroke="white" stroke-width="1.5" fill="none"/><path d="M10 10l4 4m0-4l-4 4" stroke="white" stroke-width="2" stroke-linecap="round"/>`;
    }
    
    // Default - Icono de alerta
    return `<path d="M12 9v4m0 4h.01M12 3l9 16H3L12 3z" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };

  const createFenomenoIcon = (tipo: string) => {
    const color = getFenomenoMarkerColor(tipo || '');
    const iconSvg = getFenomenoIconSvg(tipo || '');
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative; width: 36px; height: 44px;">
          <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Pin shape -->
            <path d="M18 0C8.06 0 0 8.06 0 18c0 12.6 18 26 18 26s18-13.4 18-26C36 8.06 27.94 0 18 0z" fill="${color}"/>
            <path d="M18 1C8.61 1 1 8.61 1 18c0 5.9 3.2 11.8 7.5 16.7 3.4 3.9 7.2 7.1 9.5 8.8 2.3-1.7 6.1-4.9 9.5-8.8C31.8 29.8 35 23.9 35 18c0-9.39-7.61-17-17-17z" fill="${color}" stroke="white" stroke-width="1.5"/>
            <!-- Inner circle background -->
            <circle cx="18" cy="16" r="11" fill="${color}"/>
            <!-- Icon -->
            <g transform="translate(6, 4)">
              ${iconSvg}
            </g>
          </svg>
        </div>
      `,
      iconSize: [36, 44],
      iconAnchor: [18, 44],
      popupAnchor: [0, -44],
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
