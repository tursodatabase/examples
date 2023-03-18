import { type ResultSet, type SqlValue } from "@libsql/client";

export function responseDataAdapter(data: ResultSet): any[] {
  if (!data?.columns || !data?.rows) {
    throw new Error("Malformed response from turso");
  }

  const { columns, rows } = data;
  const formattedData: any[] = [];

  for (const row of rows) {
    const rowData: { [k: string]: SqlValue } = {};
    for (let i = 0; i < columns.length; i++) {
      rowData[columns[i]] = row[i];
    }

    // This line of code is assuming that all of the fields of
    // data returned are present in the columns and rows of the
    // ResultSet, and their types match. Ideally, this code checks the presence
    // and validity of each value in the ResultSet before passing it along to
    // the caller.
    formattedData.push(rowData as unknown as any);
  }

  return formattedData;
}
