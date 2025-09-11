// src/App.tsx
import React, { useState, lazy, Suspense } from "react";
import type { SyntheticEvent } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { AppProvider } from "./context/AppContext";
import { UserProvider } from "./context/UserContext";
import NavigationTabs from "./components/NavigationTabs";
import ErrorSnackbar from "./components/ErrorSnackbar";

// Defensive lazy helper (works with named or default exports)
const lazyDefault = (loader: () => Promise<any>, named?: string) =>
  lazy(() =>
    loader().then(mod => {
      try {
        if (named && mod && Object.prototype.hasOwnProperty.call(mod, named)) {
          return { default: mod[named] };
        }
        if (mod && mod.default) {
          return { default: mod.default };
        }
        const keys = mod ? Object.keys(mod).filter(k => k !== "__esModule") : [];
        if (keys.length === 1) {
          return { default: mod[keys[0]] };
        }
        return { default: (mod as any) };
      } catch (err) {
        return { default: (mod as any) };
      }
    })
  );

// Lazy components
const Dashboard = lazyDefault(() => import("./components/Dashboard"), "Dashboard");
const Forecast  = lazyDefault(() => import("./components/Forecast"), "Forecast");
const Reports   = lazyDefault(() => import("./components/Reports"), "Reports");
const Settings  = lazyDefault(() => import("./components/Settings"), "Settings");
const Analytics = lazyDefault(() => import("./components/Analytics"), "Analytics");
const Onboarding= lazyDefault(() => import("./components/Onboarding"), "Onboarding");

type Page =
  | "dashboard"
  | "forecast"
  | "reports"
  | "settings"
  | "analytics"
  | "onboarding";

const pageToComponent: Record<Page, React.LazyExoticComponent<React.ComponentType<any>>> = {
  dashboard: Dashboard,
  forecast: Forecast,
  reports: Reports,
  settings: Settings,
  analytics: Analytics,
  onboarding: Onboarding,
};

export default function App(): JSX.Element {
  const [page, setPage] = useState<Page>("dashboard");

  // NavigationTabs likely uses the (event, value) signature similar to MUI Tabs.
  // We accept either string or number and coerce to our Page set.
  const handleNavChange = (_event: SyntheticEvent, value: unknown) => {
    if (typeof value === "string") {
      if (isPage(value)) setPage(value);
    } else if (typeof value === "number") {
      // optional numeric mapping fallback — keep predictable: map index to pages
      const map: Page[] = ["dashboard", "forecast", "reports", "analytics", "settings", "onboarding"];
      const idx = Math.max(0, Math.min(map.length - 1, value));
      setPage(map[idx]);
    }
  };

  const ActiveComponent = pageToComponent[page];

  return (
    <AppProvider>
      <UserProvider>
        <CssBaseline />
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Insight Hunter
            </Typography>
            {/* You can put top-right actions (profile, logout) here if desired */}
          </Toolbar>
        </AppBar>

        <Box component="nav" sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Container maxWidth="lg">
            {/* NavigationTabs is assumed to accept `value` + `onChange` (MUI-like) */}
            <NavigationTabs value={page} onChange={handleNavChange} />
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
          <Suspense
            fallback={
              <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <CircularProgress />
              </Box>
            }
          >
            <Box sx={{ minHeight: "60vh" }}>
              <ActiveComponent />
            </Box>
          </Suspense>
        </Container>

        <ErrorSnackbar />
      </UserProvider>
    </AppProvider>
  );
}

/* ---------- helpers ---------- */

function isPage(v: string): v is Page {
  return (
    v === "dashboard" ||
    v === "forecast" ||
    v === "reports" ||
    v === "settings" ||
    v === "analytics" ||
    v === "onboarding"
  );
}