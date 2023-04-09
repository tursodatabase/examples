/** 
 * @description Turso data response formatter
 * @param {Object} data - Turso http results objecy
 */
export default function responseDataAdapter(data) {
  if (!data?.columns || !data?.rows) {
    throw new Error("Malformed response from turso");
  }

  const { columns, rows } = data;
  const formattedData = [];

  for (const row of rows) {
    const rowData = {};
    for (let i = 0; i < columns.length; i++) {
      rowData[columns[i]] = row[i];
    }
    formattedData.push(rowData);
  }

  return formattedData;
}