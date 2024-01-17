export default defineEventHandler(async (event) => {
  const client = useTurso();
  const result = await client.execute(
    "select * from frameworks order by stars desc"
  );
  const cityHeader = getHeader(event, "x-vercel-ip-city");
  const city = cityHeader ? decodeURIComponent(cityHeader) : "-";

  return {
    message: "Frameworks fetched!",
    data: {
      frameworks: result.rows,
      city,
    },
  };
});
