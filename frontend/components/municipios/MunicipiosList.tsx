'use client';

import { useState, useEffect } from 'react';
import MunicipioCard from './MunicipioCard';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import Skeleton from '@/components/ui/Skeleton';
import { useMunicipios } from '@/lib/hooks/useMunicipios';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { AlertTriangle, Search } from 'lucide-react';

export default function MunicipiosList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, error } = useMunicipios(page, 20, debouncedSearch);

  // Resetear a página 1 cuando cambia la búsqueda
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Error al cargar municipios</h3>
          <p className="text-slate-500">No se pudieron cargar los datos. Intenta de nuevo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <Input
          placeholder="Buscar municipio por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64">
              <Skeleton className="w-full h-full" />
            </div>
          ))
        ) : data?.data && data.data.length > 0 ? (
          data.data.map((municipio) => (
            <MunicipioCard key={municipio.id} municipio={municipio} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500">
              {searchTerm 
                ? `No se encontraron municipios con el término "${searchTerm}"`
                : 'No hay municipios disponibles'
              }
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {data?.meta && (
        <Pagination
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
