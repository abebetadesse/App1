import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ActivityChart({ data }) {
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Profile Views',
      data: data || [12, 19, 15, 17, 22, 30, 28],
      borderColor: '#646cff',
      backgroundColor: 'rgba(100,108,255,0.2)',
      tension: 0.4
    }]
  };
  const options = { responsive: true, maintainAspectRatio: false };
  return <Line data={chartData} options={options} height={250} />;
}
