import 'dotenv/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

const client = createClient({
  url: process.env.TURSO_URL as string,
  authToken: process.env.TURSO_AUTH_TOKEN as string,
});

export const db = drizzle(client);

async function main() {
  await migrate(db, {
    migrationsFolder: './drizzle/migrations',
  });
}

main()
  .then((res) => {
    console.log('Tables migrated!');
    client.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error performing migration: ', err);
    client.close();
    process.exit(1);
  });
