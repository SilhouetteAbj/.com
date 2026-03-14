/**
 * Environment configuration
 * Provides safe access to environment variables with type safety
 */

export const env = {
  // Supabase
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,

  // API
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173',

  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  // Analytics
  googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  segmentWriteKey: import.meta.env.VITE_SEGMENT_WRITE_KEY,

  // Email
  emailServiceId: import.meta.env.VITE_EMAIL_SERVICE_ID,
  emailTemplateId: import.meta.env.VITE_EMAIL_TEMPLATE_ID,

  // Chat
  chatEnabled: import.meta.env.VITE_CHAT_ENABLED === 'true',
  chatPollingInterval: parseInt(import.meta.env.VITE_CHAT_POLLING_INTERVAL || '3000'),

  // Feature flags
  enableAdminDashboard: import.meta.env.VITE_ENABLE_ADMIN_DASHBOARD === 'true',
  enableBookingForm: import.meta.env.VITE_ENABLE_BOOKING_FORM === 'true',
  enableChatWidget: import.meta.env.VITE_ENABLE_CHAT_WIDGET === 'true',
};

// Validate required environment variables
if (!env.supabaseUrl || !env.supabaseAnonKey) {
  if (env.isProduction) {
    throw new Error(
      'Missing required environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY'
    );
  } else {
    console.warn(
      'Missing Supabase environment variables. Some features may not work in development.'
    );
  }
}
