// Base URL for the API
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// API endpoints
export const API_URLS = {
  base: API_BASE_URL,
  api: `${API_BASE_URL}/api`,
} as const;

// Allowed origins
export const ALLOWED_ORIGINS = [
  'https://home-yum-python-api.onrender.com',
  // EAS Build environments
  'development',
  'preview',
  'production'
] as const; 