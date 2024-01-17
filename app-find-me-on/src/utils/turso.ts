import type { RequestEventCommon } from "@builder.io/qwik-city";
import { createClient, type Client } from "@libsql/client/web";

export function tursoClient(requestEvent: RequestEventCommon): Client {
  const url = requestEvent.env.get("TURSO_DB_URL");
  if(url === undefined){
    throw Error("TURSO_DB_URL must be provided!")
  }

  const authToken = requestEvent.env.get("TURSO_DB_AUTH_TOKEN");
  if(authToken === undefined){
    throw Error("TURSO_DB_AUTH_TOKEN must be provided!")
  }

  return createClient({
    url,
    authToken
  });
}