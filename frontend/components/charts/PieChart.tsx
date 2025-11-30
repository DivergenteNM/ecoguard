'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  title: string;
  labels: string[];
  data: number[];
  colors?: string[];
  height?: number;
}

const DEFAULT_COLORS = [
  '#DC2626', // red-600
  '#2563EB', // blue-600
  '#D97706', // amber-600
  '#059669', // emerald-600
  '#7C3AED', // violet-600
  '#DB2777', // pink-600
];

export default function PieChart({ 
  title, 
  labels, 
  data,
  colors = DEFAULT_COLORS,
  height = 300 
}: PieChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: colors.map(c => c),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: false,
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
          <Pie data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
