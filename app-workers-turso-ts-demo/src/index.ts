/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { createClient } from "@libsql/client/http";

export interface Env {
  TURSO_DB_URL: string,
  TURSO_DB_AUTH_TOKEN: string,
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const client = createClient({
      url: env.TURSO_DB_URL,
      authToken: env.TURSO_DB_AUTH_TOKEN
    })
		
    const queryDb = await client.execute("select * from frameworks");
    const frameworks = queryDb.rows;
    let table = "<table>";
    table += "<tr> <th>Name</th> <th>Language</th> <th>Github Stars</th> <th>Github URL</th> </tr> <tbody>";
    table += frameworks.map((item) => `<tr>
    <td>${item.name}</td>
    <td>${item.language}</td>
    <td>${item.stars}</td>
    <td> <a href="${item.url}" target="_blank">Visit</a> </td>
    </tr>`).join("");
    table +="</tbody></table>";

    return new Response(table, {
      status: 200,
      headers: {
        "Content-Type": "text/html"
      }
    });
  },
};
