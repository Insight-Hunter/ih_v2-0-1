import { useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Metrics } from '../types';

const mockMetrics: Metrics = {
  totalRevenue: 123456,
  monthlyGrowth: 15.7,
  cashFlow: 76543,
};

export const useMetrics = (currentPage: string) => {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("useMetrics must be used within AppProvider");

  const { dispatch } = appContext;

  useEffect(() => {
    const loadMetrics = async () => {
      if (currentPage !== 'dashboard') return;
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      try {
        // Replace with real API call for metrics
        await new Promise((r) => setTimeout(r, 1000));
        dispatch({ type: 'SET_METRICS', payload: mockMetrics });
      } catch {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load metrics' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadMetrics();
  }, [currentPage, dispatch]);
};
