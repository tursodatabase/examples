export default defineEventHandler(async (event) => {
  const {name, language, url, stars} = await readBody(event);

  if(!name || !language || !url || !stars)
    throw createError({
      message: "Missing fields!",
      statusCode: 400
    })

  const client = useTurso();
  
  await client.execute({
    sql: "insert into frameworks(name, language, url, stars) values(?, ?, ?, ?)",
    args: [
      name, language, url, stars,
    ]
  });

  const framework = await client.execute({
    sql: "select * from frameworks where url = ?",
    args: [url]
  })

  return {
    message: "Framework added!",
    data: responseDataAdapter(framework)
  };

})