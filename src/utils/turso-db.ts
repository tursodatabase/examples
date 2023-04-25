import { createClient } from "@libsql/client/web";
const config = {
  url: import.meta.env.VITE_TURSO_DB_URL,
  authToken: import.meta.env.VITE_TURSO_DB_AUTH_TOKEN
}
export const client = createClient(config);