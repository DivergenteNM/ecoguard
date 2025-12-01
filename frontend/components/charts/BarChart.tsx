'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  title: string;
  labels: string[];
  data: number[];
  color?: string;
  height?: number;
}

// Función para generar colores en gradiente basados en el valor
function generateGradientColors(data: number[], baseColor: string): string[] {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  return data.map(value => {
    // Calcular intensidad base (0 a 1)
    const rawIntensity = range === 0 ? 1 : (value - min) / range;

    // Limitar la intensidad mínima a 0.5 para que las barras siempre sean visibles
    // Esto significa que el color más claro será 50% del camino hacia el blanco
    const intensity = 0.5 + (rawIntensity * 0.5);

    // Crear gradiente de claro a oscuro basado en el valor
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    // Interpolar entre una versión clara y la versión completa del color
    const newR = Math.round(r + (255 - r) * (1 - intensity));
    const newG = Math.round(g + (255 - g) * (1 - intensity));
    const newB = Math.round(b + (255 - b) * (1 - intensity));

    return `rgb(${newR}, ${newG}, ${newB})`;
  });
}

// Función para formatear números con separadores de miles
function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-CO').format(num);
}

export default function BarChart({
  title,
  labels,
  data,
  color = '#059669',
  height = 300
}: BarChartProps) {
  const backgroundColors = generateGradientColors(data, color);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Población',
        data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map((c: string) => c.replace('rgb', 'rgba').replace(')', ', 0.8)')),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const, // Gráfico horizontal
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context: any) {
            return `Población: ${formatNumber(context.parsed.x)}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          precision: 0,
          font: {
            size: 11,
          },
          callback: function (value: any) {
            return formatNumber(value);
          }
        },
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: 500,
          },
          color: '#334155',
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">Top 10 municipios por población</p>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
