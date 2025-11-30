'use client';

import { useState } from 'react';
import FenomenoCard from './FenomenoCard';
import FenomenoFilters from './FenomenoFilters';
import Pagination from '@/components/ui/Pagination';
import Skeleton from '@/components/ui/Skeleton';
import { useFenomenos } from '@/lib/hooks/useFenomenos';
import { FenomenoFilters as FilterState } from '@/lib/types/fenomeno.types';
import { AlertTriangle } from 'lucide-react';

export default function FenomenosList() {
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error } = useFenomenos(filters);

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Error al cargar fenómenos</h3>
          <p className="text-slate-500">No se pudieron cargar los datos. Intenta de nuevo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FenomenoFilters filters={filters} onFiltersChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48">
              <Skeleton className="w-full h-full" />
            </div>
          ))
        ) : data?.data && data.data.length > 0 ? (
          data.data.map((fenomeno) => (
            <FenomenoCard key={fenomeno.id} fenomeno={fenomeno} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500">No se encontraron fenómenos con los filtros aplicados.</p>
          </div>
        )}
      </div>

      {data?.meta && (
        <Pagination
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
