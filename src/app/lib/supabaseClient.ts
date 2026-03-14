import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const cookieStorage = {
  getItem: (key: string) => {
    if (typeof document === 'undefined') return null;
    const escapedKey = encodeURIComponent(key);
    const match = document.cookie.match(new RegExp(`(?:^|; )${escapedKey}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  },
  setItem: (key: string, value: string) => {
    if (typeof document === 'undefined') return;
    const escapedKey = encodeURIComponent(key);
    const escapedValue = encodeURIComponent(value);
    const secure = window.location.protocol === 'https:' ? '; secure' : '';
    document.cookie = `${escapedKey}=${escapedValue}; path=/; max-age=2592000; samesite=lax${secure}`;
  },
  removeItem: (key: string) => {
    if (typeof document === 'undefined') return;
    const escapedKey = encodeURIComponent(key);
    document.cookie = `${escapedKey}=; path=/; max-age=0; samesite=lax`;
  },
};

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('Supabase environment variables are missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage: cookieStorage,
    },
  }
);
