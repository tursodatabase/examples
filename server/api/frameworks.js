import useTurso from "~~/composables/use-turso";

export default defineEventHandler(async (event) => {
  const client = useTurso();
  const result = await client.execute("select * from frameworks order by stars desc");
  const cityHeader = getHeader(event, 'x-vercel-ip-city');
  const city = cityHeader ? decodeURIComponent(cityHeader) : '-';

  console.log({ city });

  return {
    message: "Frameworks fetched!",
    data: {
      frameworks: responseDataAdapter(result),
      city
    }
  };
})