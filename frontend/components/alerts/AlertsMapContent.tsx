'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MOCK_ALERTS = [
  {
    id: '1',
    tipo: 'INUNDACIÓN',
    municipio: 'Tumaco',
    nivel: 'alto',
    probabilidad: 0.85,
    coordenadas: { lat: 1.8, lng: -78.8 },
  },
  {
    id: '2',
    tipo: 'DESLIZAMIENTO',
    municipio: 'Pasto',
    nivel: 'medio',
    probabilidad: 0.62,
    coordenadas: { lat: 1.21, lng: -77.28 },
  },
  {
    id: '3',
    tipo: 'AVENIDA TORRENCIAL',
    municipio: 'Ipiales',
    nivel: 'critico',
    probabilidad: 0.92,
    coordenadas: { lat: 0.83, lng: -77.64 },
  },
];

const getMarkerColor = (nivel: string) => {
  switch (nivel) {
    case 'critico': return '#DC2626';
    case 'alto': return '#EA580C';
    case 'medio': return '#CA8A04';
    case 'bajo': return '#059669';
    default: return '#64748B';
  }
};

const getCircleRadius = (probabilidad: number) => {
  return probabilidad * 15000; // Radio en metros
};

export default function AlertsMapContent() {
  const centerNarino = { lat: 1.2, lng: -77.5 };

  return (
    <div className="h-[500px] rounded-lg overflow-hidden border border-slate-200">
      <MapContainer
        center={[centerNarino.lat, centerNarino.lng]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {MOCK_ALERTS.map((alert) => (
          <div key={alert.id}>
            <Circle
              center={[alert.coordenadas.lat, alert.coordenadas.lng]}
              radius={getCircleRadius(alert.probabilidad)}
              pathOptions={{
                color: getMarkerColor(alert.nivel),
                fillColor: getMarkerColor(alert.nivel),
                fillOpacity: 0.2,
                weight: 2,
              }}
            />
            <Marker position={[alert.coordenadas.lat, alert.coordenadas.lng]}>
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold text-sm mb-1">{alert.tipo}</h4>
                  <p className="text-xs text-slate-600 mb-1">{alert.municipio}</p>
                  <p className="text-xs">
                    <span className="font-semibold">Nivel:</span>{' '}
                    <span className={`capitalize ${
                      alert.nivel === 'critico' ? 'text-red-600' :
                      alert.nivel === 'alto' ? 'text-orange-600' :
                      alert.nivel === 'medio' ? 'text-yellow-600' :
                      'text-emerald-600'
                    }`}>
                      {alert.nivel}
                    </span>
                  </p>
                  <p className="text-xs">
                    <span className="font-semibold">Probabilidad:</span>{' '}
                    {(alert.probabilidad * 100).toFixed(0)}%
                  </p>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
