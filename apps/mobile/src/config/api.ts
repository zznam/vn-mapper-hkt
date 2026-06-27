import Constants from 'expo-constants';

/**
 * The base URL for the VN Mapper API.
 *
 * Override at build time by setting `extra.apiBaseUrl` in app.json / app.config.ts,
 * or via the EXPO_PUBLIC_API_BASE_URL environment variable.
 *
 * Precedence: EXPO_PUBLIC env var > app.json extra > localhost fallback
 */
export const API_BASE_URL: string =
  process.env['EXPO_PUBLIC_API_BASE_URL'] ??
  (Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined)?.apiBaseUrl ??
  'http://localhost:3001';
