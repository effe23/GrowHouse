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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: number[];
  labels: string[];
  events?: string[];
}

const LineChart = ({ data, labels, events }: LineChartProps) => {
  const chartData = {
    labels: labels.map(label => new Date(parseInt(label)).toLocaleTimeString()),
    datasets: [
      {
        label: 'Value',
        data: data,
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const eventLabel = events?.includes(context.label) ? ' (Pump Activated)' : '';
            return `${label}: ${value}${eventLabel}`;
          },
        },
      },
    },
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: { title: { display: true, text: 'Value' } },
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
