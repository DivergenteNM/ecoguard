'use client';

import { useFenomenos } from '@/lib/hooks/useFenomenos';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import Skeleton from '@/components/ui/Skeleton';
import { Calendar } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function FenomenosTimeline() {
  const { data, isLoading } = useFenomenos({ page: 1, limit: 1000 });

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <Skeleton className="h-64" />
      </div>
    );
  }

  const fenomenos = data?.data || [];

  // Agrupar por mes
  const eventosPorMes = fenomenos.reduce((acc, fenomeno) => {
    if (!fenomeno.fechaReporte) return acc;
    const fecha = new Date(fenomeno.fechaReporte);
    if (isNaN(fecha.getTime())) return acc; // Validar fecha
    const mesAno = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    acc[mesAno] = (acc[mesAno] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Ordenar por fecha y tomar los últimos 12 meses
  const mesesOrdenados = Object.keys(eventosPorMes)
    .sort((a, b) => {
      const [mesA, anoA] = a.split('/').map(Number);
      const [mesB, anoB] = b.split('/').map(Number);
      return new Date(anoA, mesA - 1).getTime() - new Date(anoB, mesB - 1).getTime();
    })
    .slice(-12);

  const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  const labels = mesesOrdenados.map(mesAno => {
    const [mes, ano] = mesAno.split('/').map(Number);
    return `${mesesNombres[mes - 1]} ${ano}`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Eventos registrados',
        data: mesesOrdenados.map(mes => eventosPorMes[mes] || 0),
        borderColor: 'rgb(220, 38, 38)',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(220, 38, 38)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
            return `${context.parsed.y} eventos`;
          }
        }
      },
    },
    scales: {
      y: {
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
      x: {
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

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="text-red-600" size={20} />
        <h3 className="font-bold text-slate-800">Tendencia Temporal</h3>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Evolución de eventos en los últimos 12 meses
      </p>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Total en período:</span>
          <span className="font-semibold text-slate-800">
            {mesesOrdenados.reduce((sum, mes) => sum + (eventosPorMes[mes] || 0), 0)} eventos
          </span>
        </div>
      </div>
    </div>
  );
}
