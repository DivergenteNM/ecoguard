'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Municipio } from '@/lib/types/municipio.types';
import Spinner, { LoadingOverlay } from '@/components/ui/Spinner';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

const InteractiveMap = dynamic(() => import('@/components/map/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-100 rounded-lg flex items-center justify-center">
      <LoadingOverlay message="Cargando mapa..." />
    </div>
  ),
});

interface MunicipiosMapProps {
  municipios: Municipio[];
}

// Función auxiliar para calcular el centroide de un MultiPolygon
function getCentroid(geom: any): { lat: number; lng: number } | null {
  if (!geom || geom.type !== 'MultiPolygon' || !geom.coordinates?.[0]?.[0]?.[0]) {
    return null;
  }
  
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

export default function MunicipiosMap({ municipios }: MunicipiosMapProps) {
  // Convertir municipios a GeoJSON
  const geojsonData = useMemo(() => {
    const features = municipios
      .map(m => {
        const centroid = getCentroid(m.geom);
        if (!centroid) return null;
        
        return {
          type: 'Feature' as const,
          id: m.id,
          geometry: {
            type: 'Point' as const,
            coordinates: [centroid.lng, centroid.lat],
          },
          properties: {
            id: m.id,
            nombre: m.nombre,
            poblacion: m.poblacionTotal || m.poblacion,
            departamento: m.departamento,
          },
        };
      })
      .filter(Boolean);

    return {
      type: 'FeatureCollection' as const,
      features,
    };
  }, [municipios]);

  // Calcular el centro basado en todos los centroids
  const mapCenter = useMemo(() => {
    if (!geojsonData.features.length) return [-66.5, 40] as [number, number];
    
    const lngs = geojsonData.features.map((f: any) => f.geometry.coordinates[0]);
    const lats = geojsonData.features.map((f: any) => f.geometry.coordinates[1]);
    
    const avgLng = lngs.reduce((a: number, b: number) => a + b, 0) / lngs.length;
    const avgLat = lats.reduce((a: number, b: number) => a + b, 0) / lats.length;
    
    return [avgLat, avgLng] as [number, number];
  }, [geojsonData]);

  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold text-slate-800">Mapa de Municipios</h3>
        <p className="text-sm text-slate-500">Ubicación de los municipios de Nariño</p>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <InteractiveMap
            key={`map-${municipios.length}`}
            fenomenosData={geojsonData as any}
            showFenomenos={true}
            showAmenazas={false}
            center={mapCenter}
            zoom={7}
          />
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>⚠️ Nota:</strong> Las coordenadas en la base de datos parecen estar incorrectas. 
            Deberían estar en el rango de Colombia (lat: 0.5-2, lng: -77 a -79), pero están en lat: 39-40, lng: -66 a -67.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
