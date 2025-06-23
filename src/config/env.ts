// File: src/config/env.ts
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://horexapi.watsorder.com',
  appName: import.meta.env.VITE_APP_NAME || 'POS System',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};
