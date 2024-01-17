import { Client, createClient } from '@libsql/client/http';

export function tursoClient(): Client {
  const url = process.env.NEXT_TURSO_DB_URL?.trim();
  if (url === undefined) {
    throw new Error('TURSO_DB_URL is not defined');
  }

  const authToken = process.env.NEXT_TURSO_DB_AUTH_TOKEN?.trim();
  if (authToken === undefined) {
    if (!url.includes('file:')) {
      throw new Error('TURSO_DB_AUTH_TOKEN is not defined');
    }
  }

  return createClient({
    url: process.env.NEXT_TURSO_DB_URL as string,
    authToken: process.env.NEXT_TURSO_DB_AUTH_TOKEN as string,
  });
}
