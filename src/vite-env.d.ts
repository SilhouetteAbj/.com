/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_ANALYTICS_ID?: string;
  readonly VITE_SEGMENT_WRITE_KEY?: string;
  readonly VITE_EMAIL_SERVICE_ID?: string;
  readonly VITE_EMAIL_TEMPLATE_ID?: string;
  readonly VITE_CHAT_ENABLED: string;
  readonly VITE_CHAT_POLLING_INTERVAL: string;
  readonly VITE_ENABLE_ADMIN_DASHBOARD: string;
  readonly VITE_ENABLE_BOOKING_FORM: string;
  readonly VITE_ENABLE_CHAT_WIDGET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    gtag: (command: string, id: string, config?: any) => void;
  }
}
