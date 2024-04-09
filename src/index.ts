import { Hono } from "hono";
import { createClient } from "@libsql/client";
import { v4 as uuidv4 } from "uuid";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL as string,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

db.executeMultiple(
  "CREATE TABLE IF NOT EXISTS expenses(id VARCHAR NOT NULL, amount INTEGER NOT NULL, information TEXT, date INTEGER NOT NULL)"
);

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello, welcome to My Expenses Tracker! ❤︎ Turso");
});

app.post("/records", async (c) => {
  const body = await c.req.json();
  const { amount, information } = body;
  const id = uuidv4();
  const _ = await db.execute({
    sql: "INSERT INTO expenses values (?, ?, ?, ?)",
    args: [id, amount, information, Number((Date.now() / 1000).toFixed(0))],
  });

  const results = await db.execute({
    sql: "SELECT * FROM expenses WHERE id = ?",
    args: [id],
  });
  const record = results.rows[0];
  return c.json({ record }, 201);
});

app.get("/records", async (c) => {
  const { rows } = await db.execute("SELECT * FROM expenses");
  return c.json({ rows });
});

export default app;
