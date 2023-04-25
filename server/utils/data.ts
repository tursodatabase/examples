/** 
 * @description Turso data response formatter
 * @param {Object} data - Turso http results objecy
 */
export function responseDataAdapter(data: any) {
  if (!data?.columns || !data?.rows) {
    throw new Error("Malformed response from turso");
  }

  const { columns, rows } = data;
  const formattedData = [];

  for (const row of rows) {
    const rowData: any = {};
    for (let i = 0; i < columns.length; i++) {
      rowData[columns[i]] = row[i];
    }
    formattedData.push(rowData);
  }

  return formattedData;
}