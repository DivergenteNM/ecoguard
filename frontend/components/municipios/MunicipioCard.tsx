'use client';

import { MapPin, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Municipio } from '@/lib/types/municipio.types';
import { formatNumber } from '@/lib/utils/formatters';

interface MunicipioCardProps {
  municipio: Municipio;
  onClick?: () => void;
}

// Función auxiliar para calcular el centroide de un MultiPolygon
function getCentroid(geom: any): { lat: number; lng: number } | null {
  if (!geom || geom.type !== 'MultiPolygon' || !geom.coordinates?.[0]?.[0]?.[0]) {
    return null;
  }
  
  // Obtener el primer polígono y calcular el promedio de coordenadas
  const coords = geom.coordinates[0][0];
  let sumLat = 0;
  let sumLng = 0;
  
  coords.forEach((coord: number[]) => {
    sumLng += coord[0];
    sumLat += coord[1];
  });
  
  return {
    lng: sumLng / coords.length,
    lat: sumLat / coords.length
  };
}

export default function MunicipioCard({ municipio, onClick }: MunicipioCardProps) {
  const centroid = getCentroid(municipio.geom);
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{municipio.nombre}</h3>
            <p className="text-sm text-slate-500">Código: {municipio.codigo}</p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <MapPin className="text-blue-600" size={20} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500 mb-1">Población</p>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">
                  {municipio.poblacionTotal || municipio.poblacion ? formatNumber(municipio.poblacionTotal || municipio.poblacion || 0) : 'N/A'}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 mb-1">Departamento</p>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">
                  {municipio.departamento}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500 mb-1">Latitud</p>
              <span className="text-sm font-medium text-slate-700">
                {centroid ? centroid.lat.toFixed(4) : 'N/A'}
              </span>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 mb-1">Longitud</p>
              <span className="text-sm font-medium text-slate-700">
                {centroid ? centroid.lng.toFixed(4) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
