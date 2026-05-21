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
