import React from 'react';
import { Typography, Box } from '@mui/material';

export const Onboarding: React.FC = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Onboarding
    </Typography>
    <Typography>Welcome! Get started with these simple steps:</Typography>
    <ol>
      <li>Connect accounting software (QuickBooks/Xero)</li>
      <li>Upload transactions or link bank accounts</li>
      <li>Enable invoice and wallet sync</li>
      <li>Receive automated forecasts and reports</li>
    </ol>
  </Box>
);
