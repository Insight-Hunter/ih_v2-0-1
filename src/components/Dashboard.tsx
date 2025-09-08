import React, { useContext } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { AppContext } from '../context/AppContext';
import { SummaryCard } from './SummaryCard';

export const Dashboard: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) return null;

  const { state } = appContext;
  const { metrics, loading } = state;

  if (loading) return <CircularProgress />;
  if (!metrics) return <Typography>No data available</Typography>;

  const data = {
    labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
    datasets: [
      {
        label: 'Total Revenue',
        data: Array.from({ length: 12 }, () => metrics.totalRevenue / 12 + Math.random() * 1000),
        borderColor: '#0077ff',
        backgroundColor: 'rgba(0, 119, 255, 0.1)',
        fill: true,
      },
      {
        label: 'Cash Flow',
        data: Array.from({ length: 12 }, () => metrics.cashFlow / 12 + Math.random() * 800),
        borderColor: '#ff4081',
        backgroundColor: 'rgba(255, 64, 129, 0.1)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Financial Metrics (Last 12 Months)' },
    },
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <SummaryCard title="Total Revenue" value={`$${metrics.totalRevenue.toLocaleString()}`} />
        <SummaryCard title="Monthly Growth" value={`${metrics.monthlyGrowth.toFixed(1)}%`} />
        <SummaryCard title="Cash Flow" value={`$${metrics.cashFlow.toLocaleString()}`} />
      </Box>
      <Line data={data} options={options} />
    </Box>
  );
};
