import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

const API_BASE = process.env.REACT_APP_API_BASE_URL ?? '';

export const useAuth = () => {
  const userContext = useContext(UserContext);
  if (!userContext) throw new Error('useAuth must be inside UserProvider');

  const { user, setUser } = userContext;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(await res.text());
      setLoading(false);
    } catch (e: any) {
      setError(e.message || 'Signup failed');
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      localStorage.setItem('token', data.token);
      setUser({ email }); // minimal user object, call further API if needed
      setLoading(false);
    } catch (e: any) {
      setError(e.message || 'Login failed');
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, signup, login, logout, loading, error };
};
