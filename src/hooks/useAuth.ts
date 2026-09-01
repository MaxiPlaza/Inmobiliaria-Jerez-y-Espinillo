import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// Predefinidos de simulación para desarrollo inmediato
export const MOCK_ADMIN_EMAIL = "admin@magnuspropiedades.com";
export const MOCK_ADMIN_PASSWORD = "admin123";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Comprobar la sesión actual
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (mounted) {
          if (currentSession) {
            setSession(currentSession);
            setUser(currentSession.user);
          } else {
            // Comprobar si hay una sesión simulada en localStorage
            const simUser = localStorage.getItem('magnus_sim_user');
            if (simUser) {
              const parsedUser = JSON.parse(simUser);
              setUser(parsedUser);
              setSession({
                access_token: 'simulated-token',
                token_type: 'bearer',
                expires_in: 3600,
                refresh_token: 'simulated-refresh',
                user: parsedUser
              });
            }
          }
        }
      } catch {
        console.warn('Supabase Auth error o no disponible, comprobando sesión simulada');
        const simUser = localStorage.getItem('magnus_sim_user');
        if (simUser && mounted) {
          const parsedUser = JSON.parse(simUser);
          setUser(parsedUser);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkSession();

    // Escuchar cambios de estado en Supabase Auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
        } else {
          setSession(null);
          setUser(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Iniciar Sesión (Login)
  const login = useCallback(async (email: string, contrasena: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    const configured = isSupabaseConfigured();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: contrasena,
      });

      if (error) throw error;

      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        return { success: true };
      }
      
      throw new Error('No se pudo establecer la sesión');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (configured) {
        console.error("Autenticación Supabase falló:", errMsg);
        setLoading(false);
        return {
          success: false,
          error: errMsg === 'Failed to fetch' || errMsg.includes('API')
            ? 'Error de red. Inténtalo de nuevo más tarde.'
            : errMsg
        };
      }

      console.warn("Supabase Auth falló. Intentando simulación local: ", errMsg);
      
      // Simulación de Credenciales del Dueño
      if (email.toLowerCase() === MOCK_ADMIN_EMAIL && contrasena === MOCK_ADMIN_PASSWORD) {
        const simUserObj = {
          id: 'simulated-admin-uuid',
          email: MOCK_ADMIN_EMAIL,
          role: 'authenticated',
          aud: 'authenticated',
          created_at: new Date().toISOString()
        };
        
        localStorage.setItem('magnus_sim_user', JSON.stringify(simUserObj));
        setUser(simUserObj as unknown as User);
        setSession({
          access_token: 'simulated-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'simulated-refresh',
          user: simUserObj as unknown as User
        });
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { 
        success: false, 
        error: errMsg === 'Failed to fetch' || errMsg.includes('API')
          ? `Error de red. Para simulación usa: Correo: ${MOCK_ADMIN_EMAIL} y Contraseña: ${MOCK_ADMIN_PASSWORD}`
          : errMsg
      };
    }
  }, []);

  // Cerrar Sesión (Logout)
  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch {
      console.log('Error de salida silenciado');
    } finally {
      localStorage.removeItem('magnus_sim_user');
      localStorage.removeItem('jerez_sim_user');
      setUser(null);
      setSession(null);
      setLoading(false);
    }
  }, []);

  return {
    user,
    session,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
};
