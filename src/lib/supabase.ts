import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase: Las credenciales están ausentes. Por favor configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env'
  );
}

// Inicializar el cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper para determinar si Supabase está configurado con credenciales reales en producción
export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !key) return false;
  
  // Si los valores siguen siendo los placeholders por defecto de desarrollo
  if (
    url.includes('your-project.supabase.co') || 
    url.includes('tu-proyecto.supabase.co') ||
    url.trim() === ''
  ) {
    return false;
  }
  
  if (
    key === 'your-anon-key' || 
    key === 'tu-anon-key-de-supabase' ||
    key.trim() === ''
  ) {
    return false;
  }
  
  return true;
};
