/**
 * Insight Hunter - Full React + TypeScript (TSX) app + Cloudflare Worker setup in one file
 * 
 * Instructions:
 * 1. Upload this as index.tsx in your blank repo.
 * 2. Complete these environment variables in your .env or Cloudflare environment:
 *    - REACT_APP_API_BASE_URL (Cloudflare Worker API URL)
 *    - REACT_APP_SUPABASE_URL (Supabase project URL)
 *    - REACT_APP_SUPABASE_ANON_KEY (Supabase anon key)
 * 3. Use Cloudflare Worker to proxy API requests (example included below).
 * 
 * Included:
 * - React functional components with TypeScript typing
 * - Inline styles with simple type safety
 * - Cloudflare Worker fetch proxy example
 */

import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';

// =============== Environment Variables ===================
const SUPABASE_URL: string = process.env.REACT_APP_SUPABASE_URL || "https://your-supabase-url.supabase.co";
const SUPABASE_ANON_KEY: string = process.env.REACT_APP_SUPABASE_ANON_KEY || "your-anon-key-here";
const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL || "https://your-cloudflare-worker-url.workers.dev";

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =============== Context Types ===========================
interface IUserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface IAppContext {
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

// =============== Context Setup ===========================
const UserContext = createContext<IUserContext | undefined>(undefined);
const AppContext = createContext<IAppContext | undefined>(undefined);

// =============== Inline Styles ===========================
const style = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: '0 auto',
    maxWidth: 1024,
    padding: 20,
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  } as React.CSSProperties,
  header: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#1a1a1a',
  } as React.CSSProperties,
  navBar: {
    display: 'flex',
    gap: 15,
    marginBottom: 20,
  } as React.CSSProperties,
  navButton: (active: boolean): React.CSSProperties => ({
    cursor: 'pointer',
    border: 'none',
    padding: '10px 20px',
    backgroundColor: active ? '#0077ff' : '#e0e0e0',
    color: active ? 'white' : 'black',
    borderRadius: 4,
  }),
  content: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 6,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  footer: {
    marginTop: 20,
    fontSize: '0.875rem',
    color: '#666',
  } as React.CSSProperties,
};

// =============== Navigation Bar ==========================
const NavBar: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) return null;
  const { currentPage, setCurrentPage } = appContext;
  const pages: string[] = ['dashboard', 'forecast', 'reports', 'settings', 'analytics', 'onboarding'];

  return (
    <nav style={style.navBar}>
      {pages.map(page => (
        <button
          key={page}
          style={style.navButton(currentPage === page)}
          onClick={() => setCurrentPage(page)}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page.charAt(0).toUpperCase() + page.slice(1)}
        </button>
      ))}
    </nav>
  );
};

// =============== Dashboard Component ======================
const Dashboard: React.FC = () => {
  interface Metrics {
    totalRevenue: number;
    monthlyGrowth: number;
    cashFlow: number;
  }

  const [metrics, setMetrics] = useState<Metrics>({ totalRevenue: 0, monthlyGrowth: 0, cashFlow: 0 });

  useEffect(() => {
    // Placeholder fetch or calculation for metrics, to replace with real API call
    setMetrics({ totalRevenue: 98765, monthlyGrowth: 12.5, cashFlow: 12345 });
  }, []);

  return (
    <div>
      <h2>Dashboard Overview</h2>
      <ul>
        <li>Total Revenue: ${metrics.totalRevenue.toLocaleString()}</li>
        <li>Monthly Growth: {metrics.monthlyGrowth}%</li>
        <li>Cash Flow: ${metrics.cashFlow.toLocaleString()}</li>
      </ul>
    </div>
  );
};

// =============== Forecast Component =======================
const Forecast: React.FC = () => (
  <div>
    <h2>Financial Forecast</h2>
    <p>Forecast charts and projections will be displayed here based on uploaded data.</p>
    {/* Placeholder for chart integration */}
  </div>
);

// =============== Reports Component ========================
const Reports: React.FC = () => (
  <div>
    <h2>Reports</h2>
    <p>Generate and export Profit & Loss, Cash Flow, and KPI reports as PDFs.</p>
  </div>
);

// =============== Settings Component =======================
const Settings: React.FC = () => (
  <div>
    <h2>Settings</h2>
    <p>Manage your profile, connect accounting services (QuickBooks, Xero), and configure alert preferences.</p>
  </div>
);

// =============== Analytics Component ======================
const Analytics: React.FC = () => (
  <div>
    <h2>Analytics & Trends</h2>
    <p>Insightful analytics dashboards showing trends, benchmarking, and actionable financial intelligence.</p>
  </div>
);

// =============== Onboarding Component =====================
const Onboarding: React.FC = () => (
  <div>
    <h2>Onboarding</h2>
    <ol>
      <li>Connect your accounting accounts</li>
      <li>Upload CSV or link bank transactions</li>
      <li>Enable invoice insights & wallet sync</li>
      <li>Start receiving forecasts and reports</li>
    </ol>
  </div>
);

// =============== Main App Component =======================
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <AppContext.Provider value={{ currentPage, setCurrentPage }}>
        <div style={style.container}>
          <header style={style.header}>Insight Hunter - Auto-CFO for Freelancers & SMBs</header>
          <NavBar />
          <main style={style.content}>
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'forecast' && <Forecast />}
            {currentPage === 'reports' && <Reports />}
            {currentPage === 'settings' && <Settings />}
            {currentPage === 'analytics' && <Analytics />}
            {currentPage === 'onboarding' && <Onboarding />}
          </main>
          <footer style={style.footer}>&copy; 2025 Insight Hunter. Empowering small business finance.</footer>
        </div>
      </AppContext.Provider>
    </UserContext.Provider>
  );
};

// =============== React Render Entry Point =================
const rootElement = document.getElementById('root') ?? (() => {
  const el = document.createElement('div');
  el.id = 'root';
  document.body.appendChild(el);
  return el;
})();
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

// =============== Cloudflare Worker example API proxy ===============
// This is Cloudflare Worker script for proxying API requests,
// to be deployed separately in your Cloudflare account.

/*
export async function onRequest(context: { request: Request }) {
  const request = context.request;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    const backendUrl = API_BASE_URL;
    const backendRequestUrl = backendUrl + url.pathname + url.search;

    const backendResponse = await fetch(backendRequestUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    return new Response(await backendResponse.arrayBuffer(), {
      status: backendResponse.status,
      headers: backendResponse.headers,
    });
  }

  return new Response('Welcome to Insight Hunter API Worker', { status: 200 });
}
*/

/**
 * === To complete externally ===
 * - Environment variables:
 *    REACT_APP_API_BASE_URL=https://your-cloudflare-worker-url.workers.dev
 *    REACT_APP_SUPABASE_URL=https://your-supabase-url.supabase.co
 *    REACT_APP_SUPABASE_ANON_KEY=public-anon-key
 * 
 * - Cloudflare Worker deployment with proxy API logic
 * - Supabase project set-up with Auth and DB
 * - React build/deployment on static host or Cloudflare Pages
 * - CSV upload and AI forecasting integrations to add
 * 
 * This single TSX file provides a foundational Insight Hunter frontend with essential structure,
 * typesafety, styles, navigation, and a sample Cloudflare Worker proxy snippet.
 */
