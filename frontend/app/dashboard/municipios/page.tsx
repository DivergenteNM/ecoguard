'use client';

import { useState } from 'react';
import { Map, BarChart3, List } from 'lucide-react';
import MunicipiosList from '@/components/municipios/MunicipiosList';
import MunicipioStats from '@/components/municipios/MunicipioStats';
import MunicipiosMap from '@/components/municipios/MunicipiosMap';
import { useMunicipios } from '@/lib/hooks/useMunicipios';
import Button from '@/components/ui/Button';
import Spinner, { LoadingOverlay } from '@/components/ui/Spinner';

type ViewMode = 'list' | 'stats' | 'map';

export default function MunicipiosPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('stats');
  const { data: allMunicipiosData, isLoading } = useMunicipios(1, 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Map className="text-blue-600" size={28} />
            Municipios de Nariño
          </h2>
          <p className="text-slate-500">
            Análisis demográfico y geográfico de los municipios del departamento
          </p>
        </div>

        {/* Selector de vista */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'stats' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('stats')}
          >
            <BarChart3 size={16} className="mr-2" />
            Estadísticas
          </Button>
          <Button
            variant={viewMode === 'map' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <Map size={16} className="mr-2" />
            Mapa
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List size={16} className="mr-2" />
            Lista
          </Button>
        </div>
      </div>

      {/* Contenido según vista seleccionada */}
      {isLoading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingOverlay message="Cargando municipios..." />
        </div>
      ) : (
        <>
          {viewMode === 'stats' && allMunicipiosData?.data && (
            <MunicipioStats municipios={allMunicipiosData.data} />
          )}
          
          {viewMode === 'map' && allMunicipiosData?.data && (
            <MunicipiosMap municipios={allMunicipiosData.data} />
          )}
          
          {viewMode === 'list' && <MunicipiosList />}
        </>
      )}
    </div>
  );
}
