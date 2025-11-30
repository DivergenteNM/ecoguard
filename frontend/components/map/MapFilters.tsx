'use client';

import { useState } from 'react';
import { Search, Filter, Calendar, MapPin, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { FENOMENO_TYPES } from '@/lib/utils/constants';

export interface MapFiltersState {
  tipo?: string;
  municipio?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

interface MapFiltersProps {
  filters: MapFiltersState;
  onFiltersChange: (filters: MapFiltersState) => void;
  municipios?: string[];
}

export default function MapFilters({ filters, onFiltersChange, municipios = [] }: MapFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const tipoOptions = [
    { value: '', label: 'Todos los tipos' },
    ...FENOMENO_TYPES.map(tipo => ({ value: tipo, label: tipo })),
  ];

  const municipioOptions = [
    { value: '', label: 'Todos los municipios' },
    ...municipios.map(m => ({ value: m, label: m })),
  ];

  const hasActiveFilters = Object.values(filters).some(v => v);

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg border border-slate-200 w-80">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-800">Filtros</h3>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
              Activos
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
          <Select
            label="Tipo de Fenómeno"
            options={tipoOptions}
            value={filters.tipo || ''}
            onChange={(e) => onFiltersChange({ ...filters, tipo: e.target.value || undefined })}
          />

          <Select
            label="Municipio"
            options={municipioOptions}
            value={filters.municipio || ''}
            onChange={(e) => onFiltersChange({ ...filters, municipio: e.target.value || undefined })}
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Fecha Inicio"
              type="date"
              value={filters.fechaInicio || ''}
              onChange={(e) => onFiltersChange({ ...filters, fechaInicio: e.target.value || undefined })}
            />

            <Input
              label="Fecha Fin"
              type="date"
              value={filters.fechaFin || ''}
              onChange={(e) => onFiltersChange({ ...filters, fechaFin: e.target.value || undefined })}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="w-full"
            >
              <X size={16} className="mr-2" />
              Limpiar Filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
