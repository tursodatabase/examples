import { createClient } from "@libsql/client/http";

const db = createClient({
  url: "libsql://turso-crm-iku-xinnks.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJ0SnNpbW0wZkVlNnlkY2JaNXNyOVNRIn0.9WKMs2_-sfP10MlQbBiC-lk7qVfGfOrjGwUWy287-co0cDxJpitvxBREsQcOCu8GfG8hgk3rUh6YRIwye0nhDA",
});

async function main() {
  const response = await db.execute(
    "create table if not exists foo (bar varchar);"
  );

  console.log(JSON.stringify({ response }));

  const addData = await db.execute(`insert insto foo values ("test 1")`);

  console.log(JSON.stringify({ addData }));
}

main();
