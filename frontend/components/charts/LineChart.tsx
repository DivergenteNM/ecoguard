'use client';

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
import { Line } from 'react-chartjs-2';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

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

interface LineChartProps {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
  height?: number;
}

export default function LineChart({ 
  title, 
  labels, 
  datasets,
  height = 300 
}: LineChartProps) {
  const chartData = {
    labels,
    datasets: datasets.map(ds => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color,
      backgroundColor: `${ds.color}20`,
      fill: true,
      tension: 0.4,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: datasets.length > 1,
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold text-slate-800">{title}</h3>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
