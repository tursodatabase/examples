import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/http";

export const client = createClient({
  url: TURSO_DB_URL as string,
  authToken: TURSO_DB_AUTH_TOKEN as string,
});

export const db = drizzle(client);
