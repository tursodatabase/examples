import { createClient } from "@libsql/client";

export function useTurso() {
  const tursoConfig = useRuntimeConfig().turso;

  if (!tursoConfig.dbUrl || !tursoConfig.dbAuthToken) {
    throw new Error(
      "Please fill the NUXT_TURSO_DB_URL and NUXT_TURSO_DB_AUTH_TOKEN env variables"
    );
  }
  return createClient({
    url: tursoConfig.dbUrl,
    authToken: tursoConfig.dbAuthToken,
  });
}
