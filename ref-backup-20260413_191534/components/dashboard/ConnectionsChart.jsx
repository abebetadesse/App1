import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ConnectionsChart() {
  const data = { labels: ['Active', 'Pending', 'Completed'], datasets: [{ data: [12, 5, 8], backgroundColor: ['#646cff', '#ffc107', '#10b981'] }] };
  return <Doughnut data={data} height={200} />;
}
