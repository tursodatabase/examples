import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/http";
import * as schema from "../../drizzle/org-schema";

interface Env {
  url: string;
  authToken: string;
}

export function buildDbClient({ url, authToken }: Env) {
  if (url === undefined) {
    throw new Error("db url is not defined");
  }

  if (authToken === undefined) {
    throw new Error("db token is not defined");
  }

  return drizzle(createClient({ url: `libsql://${url}`, authToken }), {
    schema,
  });
}
