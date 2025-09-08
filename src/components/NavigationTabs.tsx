import React, { useContext } from 'react';
import { Tabs, Tab } from '@mui/material';
import { AppContext } from '../context/AppContext';
import { Page } from '../types';

export const NavigationTabs: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) return null;

  const { state, dispatch } = appContext;
  const pages: { label: string; value: Page }[] = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Forecast', value: 'forecast' },
    { label: 'Reports', value: 'reports' },
    { label: 'Settings', value: 'settings' },
    { label: 'Analytics', value: 'analytics' },
    { label: 'Onboarding', value: 'onboarding' },
  ];

  const handleChange = (_: React.SyntheticEvent, newValue: Page) => {
    dispatch({ type: 'SET_PAGE', payload: newValue });
  };

  return (
    <Tabs value={state.currentPage} onChange={handleChange} textColor="inherit" indicatorColor="secondary">
      {pages.map((p) => (
        <Tab key={p.value} label={p.label} value={p.value} />
      ))}
    </Tabs>
  );
};
