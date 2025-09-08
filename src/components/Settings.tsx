import React, { useContext } from 'react';
import { Typography, Box } from '@mui/material';
import { UserContext } from '../context/UserContext';

export const Settings: React.FC = () => {
  const userContext = useContext(UserContext);
  if (!userContext) return null;

  const { user } = userContext;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      {user ? (
        <Typography>Manage your profile and integrations for: {user.email}</Typography>
      ) : (
        <Typography>Please log in to manage settings</Typography>
      )}
    </Box>
  );
};
