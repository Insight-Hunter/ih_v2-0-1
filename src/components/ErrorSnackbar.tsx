import React, { useContext } from 'react';
import { Snackbar } from '@mui/material';
import { AppContext } from '../context/AppContext';

export const ErrorSnackbar: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { state, dispatch } = context;

  const handleClose = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return (
    <Snackbar
      open={!!state.error}
      autoHideDuration={5000}
      onClose={handleClose}
      message={state.error}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    />
  );
};
