import React, { useContext, Suspense } from 'react';
import {
  CssBaseline,
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  CircularProgress
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppProvider, AppContext } from './context/AppContext';
import { UserProvider } from './context/UserContext';
import { useMetrics } from './hooks/useMetrics';
import { NavigationTabs } from './components/NavigationTabs';
import { ErrorSnackbar } from './components/ErrorSnackbar';

// ---- Lazy-loaded pages ----
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Forecast = React.lazy(() => import('./components/Forecast'));
const Reports = React.lazy(() => import('./components/Reports'));
const Settings = React.lazy(() => import('./components/Settings'));
const Analytics = React.lazy(() => import('./components/Analytics'));
const Onboarding = React.lazy(() => import('./components/Onboarding'));

// ---- Page type ----
type Page =
  | 'dashboard'
  | 'forecast'
  | 'reports'
  | 'settings'
  | 'analytics'
  | 'onboarding';

// ---- App Content ----
const AppContent: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) return null;

  const { state } = appContext;
  const { currentPage } = state;

  useMetrics(currentPage);

  const pages: Record<Page, JSX.Element> = {
    dashboard: <Dashboard />,
    forecast: <Forecast />,
    reports: <Reports />,
    settings: <Settings />,
    analytics: <Analytics />,
    onboarding: <Onboarding />,
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
    >
      <CssBaseline />

      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Insight Hunter – Auto-CFO Platform
          </Typography>
          <NavigationTabs />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{ flexGrow: 1, mt: 4, mb: 4 }}
      >
        <ErrorSnackbar />
        <Suspense fallback={<CircularProgress />}>
          {pages[currentPage as Page] ?? (
            <Typography>Page Not Found</Typography>
          )}
        </Suspense>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#f4f6f8',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} Insight Hunter. Empowering small business finance.
        </Typography>
      </Box>
    </Box>
  );
};

// ---- Theme ----
const theme = createTheme({
  palette: {
    primary: { main: '#1a73e8' }, // Google Blue style
    secondary: { main: '#ff9800' }, // Orange accent
    background: { default: '#fafafa' }
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
  },
});

// ---- Root App ----
export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <UserProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </UserProvider>
  </ThemeProvider>
);
