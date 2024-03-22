import { Elysia, t } from "elysia";
import { createClient } from "@libsql/client";
import { v4 as uuidv4 } from "uuid";

const port = process.env.PORT as unknown as string;
const hostname = process.env.HOSTNAME as unknown as string;

const db = createClient({
  url: process.env.LOCAL_DB as string,
  syncUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
  // syncInterval: 15 - https://docs.turso.tech/sdk/ts/reference#periodic-sync,
  encryptionKey: process.env.SECRET, // embedded replica will be encrypted hence not readable by sqlite3
});

db.executeMultiple(
  "CREATE TABLE IF NOT EXISTS expenses(id VARCHAR NOT NULL, amount INTEGER NOT NULL, information TEXT, date INTEGER NOT NULL)"
);

const app = new Elysia()
  .get("/", () => "Hello, welcome to My Expenses Tracker! ❤︎ Turso")
  .post(
    "/records",
    async ({ body }) => {
      const id = uuidv4();
      const _ = await db.execute({
        sql: "INSERT INTO expenses values (?, ?, ?, ?)",
        args: [
          id,
          body.amount,
          body.information,
          Number((Date.now() / 1000).toFixed(0)),
        ],
      });

      const results = await db.execute({
        sql: "SELECT * FROM expenses WHERE id = ?",
        args: [id],
      });
      return results.rows[0];
    },
    {
      body: t.Object({
        amount: t.Number(),
        information: t.String(),
      }),
    }
  )
  .get("/records", async () => {
    const results = await db.execute("SELECT * FROM expenses");
    return results.rows;
  })
  .listen({ hostname, port });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
