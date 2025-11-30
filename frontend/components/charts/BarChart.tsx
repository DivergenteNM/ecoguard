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

export default function BarChart({ 
  title, 
  labels, 
  data, 
  color = '#059669',
  height = 300 
}: BarChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
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
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
