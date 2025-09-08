import { useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import { UserContext } from '../context/UserContext';

export const useUserSession = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserSession must be used within UserProvider");

  const { setUser } = context;

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    };

    fetchSession();

    // Auth state change subscription
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [setUser]);
};
