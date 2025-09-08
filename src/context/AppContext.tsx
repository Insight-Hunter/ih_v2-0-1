import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';
import { AppState, Action, Page, Metrics } from '../types';

const initialState: AppState = {
  currentPage: 'dashboard',
  metrics: null,
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload, error: null };
    case 'SET_METRICS':
      return { ...state, metrics: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface AppContextProps {
  state: AppState;
  dispatch: Dispatch<Action>;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};
