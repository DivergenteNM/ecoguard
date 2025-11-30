'use client';

import { MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Fenomeno } from '@/lib/types/fenomeno.types';
import { formatDate } from '@/lib/utils/dates';
import { getFenomenoColor } from '@/lib/utils/colors';

interface FenomenoCardProps {
  fenomeno: Fenomeno;
  onClick?: () => void;
}

export default function FenomenoCard({ fenomeno, onClick }: FenomenoCardProps) {
  const color = getFenomenoColor(fenomeno.tipoFenomenoNormalizado || '');

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-${color}-50`}>
            <AlertTriangle className={`text-${color}-600`} size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-slate-800 truncate">
                {fenomeno.tipoFenomenoNormalizado}
              </h3>
              <Badge variant={color as any}>
                {fenomeno.tipoFenomenoNormalizado}
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400" />
                <span className="truncate">{fenomeno.municipio}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span>{fenomeno.fechaReporte ? formatDate(fenomeno.fechaReporte) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
