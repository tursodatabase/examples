import { createClient } from '@libsql/client/web';

export function useTurso () {
  const config = useRuntimeConfig();

  if (!config.tursoDbUrl || !config.tursoDbAuthToken) {
    throw new Error('Please fill the NUXT_TURSO_DB_URL and NUXT_TURSO_DB_AUTH_TOKEN env variables')
  }
  return createClient({
    url: config.tursoDbUrl,
    authToken: config.tursoDbAuthToken,
  });
}