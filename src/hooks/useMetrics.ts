import { useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { apiFetch } from '../services/api';

export const useMetrics = (currentPage: string) => {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("useMetrics must be used within AppProvider");

  const { dispatch } = appContext;

  useEffect(() => {
    if (currentPage !== 'dashboard') return;

    const loadMetrics = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      try {
        const metrics = await apiFetch('/api/metrics');
        dispatch({ type: 'SET_METRICS', payload: metrics });
      } catch {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load metrics' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadMetrics();
  }, [currentPage, dispatch]);
};

