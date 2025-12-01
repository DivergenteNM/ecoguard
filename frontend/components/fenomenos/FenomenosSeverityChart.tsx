'use client';

import { useFenomenos } from '@/lib/hooks/useFenomenos';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Skeleton from '@/components/ui/Skeleton';
import { Flame, AlertCircle } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FenomenosSeverityChartProps {
  fechaInicio?: string;
}

export default function FenomenosSeverityChart({ fechaInicio }: FenomenosSeverityChartProps) {
  const { data, isLoading } = useFenomenos({ page: 1, limit: 1000, fechaInicio });

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <Skeleton className="h-64" />
      </div>
    );
  }

  const fenomenos = data?.data || [];

  // Contar por tipo
  const eventosPorTipo = fenomenos.reduce((acc, fenomeno) => {
    const tipo = fenomeno.tipoFenomenoNormalizado || fenomeno.tipoFenomenoOriginal || 'Sin especificar';
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Ordenar por frecuencia y tomar top 8
  const tiposOrdenados = Object.entries(eventosPorTipo)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const labels = tiposOrdenados.map(([tipo]) => {
    // Acortar nombres largos
    return tipo.length > 20 ? tipo.substring(0, 20) + '...' : tipo;
  });

  const colores = [
    'rgba(220, 38, 38, 0.8)',   // Rojo
    'rgba(249, 115, 22, 0.8)',  // Naranja
    'rgba(234, 179, 8, 0.8)',   // Amarillo
    'rgba(34, 197, 94, 0.8)',   // Verde
    'rgba(59, 130, 246, 0.8)',  // Azul
    'rgba(139, 92, 246, 0.8)',  // Púrpura
    'rgba(236, 72, 153, 0.8)',  // Rosa
    'rgba(100, 116, 139, 0.8)', // Gris
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Eventos',
        data: tiposOrdenados.map(([, count]) => count),
        backgroundColor: colores,
        borderColor: colores.map(c => c.replace('0.8', '1')),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 14,
        },
        callbacks: {
          label: function(context: any) {
            const total = tiposOrdenados.reduce((sum, [, count]) => sum + count, 0);
            const porcentaje = ((context.parsed.x / total) * 100).toFixed(1);
            return `${context.parsed.x} eventos (${porcentaje}%)`;
          }
        }
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        ticks: {
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const totalEventos = tiposOrdenados.reduce((sum, [, count]) => sum + count, 0);
  const tipoMasFrecuente = tiposOrdenados[0];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="text-orange-600" size={20} />
        <h3 className="font-bold text-slate-800">Distribución por Tipo</h3>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Categorías más frecuentes de fenómenos naturales
      </p>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
      {tipoMasFrecuente && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-start gap-2 text-sm">
            <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={16} />
            <div>
              <span className="text-slate-600">Tipo más frecuente: </span>
              <span className="font-semibold text-slate-800">
                {tipoMasFrecuente[0]}
              </span>
              <span className="text-slate-500 ml-2">
                ({((tipoMasFrecuente[1] / totalEventos) * 100).toFixed(1)}% del total)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
