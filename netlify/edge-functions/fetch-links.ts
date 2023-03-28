import type { Context, Config } from "https://edge.netlify.com/";

export function responseDataAdapter(data: any): any[] {
  if (!data?.columns || !data?.rows) {
    throw new Error("Malformed response from turso");
  }

  const { columns, rows } = data;
  const formattedData: any[] = [];

  for (const row of rows) {
    const rowData: { [k: string]: any } = {};
    for (let i = 0; i < columns.length; i++) {
      rowData[columns[i]] = row[i];
    }
    
    formattedData.push(rowData as unknown as any);
  }

  return formattedData;
}

const translations = {
  UNKNOWN: "Hello!",
  US: "Howdy!",
  GB: "How do you do?",
  AU: "G'day, mate!",
  BR: "Olá",
  FI: "Hei",
  IN: "नमस्कार",
  HR: "Pozdrav",
  CZ: "Dobrý den",
  CA: "How's it goin', eh?",
  PT: "Olá;",
  ES: "Hola",
  TZ: "Habari!",
  ZA: "Hallo!"
};

export default async (request: Request, context: Context) => {
  const databaseUrl = Deno.env.get("VITE_TURSO_DB_URL") as string;
  const databaseAuthToken = Deno.env.get("VITE_TURSO_DB_AUTH_TOKEN") as string;
  const {username} = await request.json();
  let userData: any;

  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${databaseAuthToken}`
    }
  }

  // fetch user's data
  const userCheckStatement = [{q: `select full_name, username, id from users where username = "${username}"`}];
  const userResponse = await fetch(databaseUrl, {
    ...config,
    body: JSON.stringify({statements: userCheckStatement}),
  });
  const userJsonResponse = await userResponse.json();

  userData = responseDataAdapter(userJsonResponse[0]["results"]);
  if (!userData.length) {
    return Response.json({
      user: null,
      links: null,
    });
  }
  const { id } = userData[0];

  // fetch user's links
  const linksCheckStatements = [{q: `select website, link from links where user_id = "${id}"`}];
  const response = await fetch(databaseUrl, {
    ...config,
    body: JSON.stringify({statements: linksCheckStatements}),
  });
  const listJsonData = await response.json();


  // get localized greeting
  const countryCode = context.geo?.country?.code;
  const translation = translations[countryCode] || translations["UNKNOWN"];

  return Response.json({
    user: userData[0],
    links: responseDataAdapter(listJsonData[0]["results"]),
    greeting: `${translation}`
  });
};

export const config: Config = {path: "/get-user-links"}