import useTurso from "~~/composables/use-turso";

export default defineEventHandler(async () => {
  const client = useTurso();
  
  const result = await client.execute("select * from frameworks order by stars desc");

  return {
    message: "Frameworks fetched!",
    data: responseDataAdapter(result)
  };

})