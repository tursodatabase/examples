import type { ResultSet } from "@libsql/client";
import { createClient } from "@libsql/client/web";

export const client = createClient({
  url: import.meta.env.TURSO_DB_URL,
  authToken: import.meta.env.TURSO_DB_TOKEN
});

export const responseDataAdapter = (data: ResultSet): any[] => {
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