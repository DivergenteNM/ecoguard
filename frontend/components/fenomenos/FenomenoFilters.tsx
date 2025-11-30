'use client';

import { Filter, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { FenomenoFilters as FilterState } from '@/lib/types/fenomeno.types';
import { FENOMENO_TYPES } from '@/lib/utils/constants';

interface FenomenoFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function FenomenoFilters({ filters, onFiltersChange }: FenomenoFiltersProps) {
  const handleClearFilters = () => {
    onFiltersChange({ page: 1, limit: filters.limit });
  };

  const tipoOptions = [
    { value: '', label: 'Todos los tipos' },
    ...FENOMENO_TYPES.map(tipo => ({ value: tipo, label: tipo })),
  ];

  const hasActiveFilters = filters.tipo || filters.municipio || filters.fechaInicio || filters.fechaFin;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-slate-600" />
          <h3 className="font-semibold text-slate-800">Filtros</h3>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
              Activos
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Tipo de Fenómeno"
            options={tipoOptions}
            value={filters.tipo || ''}
            onChange={(e) => {
              const newTipo = e.target.value || undefined;
              onFiltersChange({ ...filters, tipo: newTipo, page: 1 });
            }}
          />

          <Input
            label="Municipio"
            placeholder="Ej: Pasto"
            value={filters.municipio || ''}
            onChange={(e) => {
              const newMunicipio = e.target.value.trim() || undefined;
              onFiltersChange({ ...filters, municipio: newMunicipio, page: 1 });
            }}
          />

          <Input
            label="Fecha Inicio"
            type="date"
            value={filters.fechaInicio || ''}
            onChange={(e) => onFiltersChange({ ...filters, fechaInicio: e.target.value || undefined, page: 1 })}
          />

          <Input
            label="Fecha Fin"
            type="date"
            value={filters.fechaFin || ''}
            onChange={(e) => onFiltersChange({ ...filters, fechaFin: e.target.value || undefined, page: 1 })}
          />
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X size={16} className="mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
