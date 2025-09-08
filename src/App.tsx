import React, { useContext } from 'react';
import { CssBaseline, Container, Box, Typography, AppBar, Toolbar } from '@mui/material';
import { AppProvider, AppContext } from './context/AppContext';
import { UserProvider } from './context/UserContext';
import { useMetrics } from './hooks/useMetrics';
import { NavigationTabs } from './components/NavigationTabs';
import { ErrorSnackbar } from './components/ErrorSnackbar';
import { Dashboard } from './components/Dashboard';
import { Forecast } from './components/Forecast';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Analytics } from './components/Analytics';
import { Onboarding } from './components/Onboarding';

const AppContent: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) return null;

  const { state } = appContext;
  const { currentPage } = state;

  useMetrics(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'forecast':
        return <Forecast />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'analytics':
        return <Analytics />;
      case 'onboarding':
        return <Onboarding />;
      default:
        return <Typography>Page Not Found</Typography>;
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Insight Hunter - Auto-CFO Platform
          </Typography>
          <NavigationTabs />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <ErrorSnackbar />
        {renderPage()}
      </Container>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#f4f6f8', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          &copy; 2025 Insight Hunter. Empowering small business finance.
        </Typography>
      </Box>
    </>
  );
};

export const App: React.FC = () => (
  <UserProvider>
    <AppProvider>
      <AppContent />
    </AppProvider>
  </UserProvider>
);
