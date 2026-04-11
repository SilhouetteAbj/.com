import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Health check
export const checkSupabaseConnection = async () => {
  try {
    await supabase.from('appointments').select('id').limit(1);
    return true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return false;
  }
};
