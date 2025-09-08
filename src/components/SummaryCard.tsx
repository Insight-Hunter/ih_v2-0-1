import React from 'react';
import { Box, Typography } from '@mui/material';

interface SummaryCardProps {
  title: string;
  value: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => (
  <Box
    sx={{
      p: 2,
      width: 200,
      backgroundColor: '#e3f2fd',
      borderRadius: 2,
      boxShadow: 1,
      textAlign: 'center',
      mx: 1,
    }}
  >
    <Typography variant="subtitle1" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h5" fontWeight="bold">
      {value}
    </Typography>
  </Box>
);
