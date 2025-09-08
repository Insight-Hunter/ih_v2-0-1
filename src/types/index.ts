import type { User } from '@supabase/supabase-js';

export interface Metrics {
  totalRevenue: number;
  monthlyGrowth: number;
  cashFlow: number;
}

export type Page = 'dashboard' | 'forecast' | 'reports' | 'settings' | 'analytics' | 'onboarding';

export interface AppState {
  currentPage: Page;
  metrics: Metrics | null;
  loading: boolean;
  error: string | null;
}

export type Action =
  | { type: 'SET_PAGE'; payload: Page }
  | { type: 'SET_METRICS'; payload: Metrics }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
