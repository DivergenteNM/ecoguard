'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationSelectorProps {
  position: LatLng | null;
  setPosition: (position: LatLng | null) => void;
}

function LocationSelector({ position, setPosition }: LocationSelectorProps) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

interface MapSelectorProps {
  selectedPosition: LatLng | null;
  setSelectedPosition: (position: LatLng | null) => void;
}

export default function MapSelector({ selectedPosition, setSelectedPosition }: MapSelectorProps) {
  return (
    <div className="h-[350px] rounded-lg overflow-hidden border-2 border-purple-300 shadow-lg">
      <MapContainer
        center={[1.2, -77.5]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationSelector position={selectedPosition} setPosition={setSelectedPosition} />
      </MapContainer>
    </div>
  );
}
