import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { apiFetch } from '../services/api';

export const useAuth = () => {
  const userContext = useContext(UserContext);
  if (!userContext) throw new Error('useAuth must be used within UserProvider');

  const { user, token, setUser, setToken } = userContext;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e: any) {
      setError(e.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setToken(data.token);
      setUser({ email });
    } catch (e: any) {
      setError(e.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return { user, token, loading, error, signup, login, logout };
};
