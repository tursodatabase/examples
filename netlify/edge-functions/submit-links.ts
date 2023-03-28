
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

export default async (request: Request) => {
  const databaseUrl = Deno.env.get("VITE_TURSO_DB_URL") as string;
  const databaseAuthToken = Deno.env.get("VITE_TURSO_DB_AUTH_TOKEN") as string;
  const {user, links} = await request.json();

  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${databaseAuthToken}`
    }
  }

  // submit user details
  const userSubmitStatement = [{q: `insert into users(email, full_name, username) values("${user.email}", "${user.fullname}", "${user.username}")`}];
  const userResponse = await fetch(databaseUrl, {
    ...config,
    body: JSON.stringify({statements: userSubmitStatement}),
  });

  // get user's username and id
  const getUserStatement = [{q: `select id, username from users where username = "${user.username}"`}];
  const getUserResponse = await fetch(databaseUrl, {
    ...config,
    body: JSON.stringify({statements: getUserStatement}),
  });
  const getUserJsonResponse = await getUserResponse.json();

  const createdUserData = responseDataAdapter(getUserJsonResponse[0]["results"]);
  if (!createdUserData.length) {
    return Response.json({
      user: null,
      links: null,
    });
  }
  const { id, username } = createdUserData[0];

  // store user's links
  for(const link of links){
    const linkSubmitStatements = [{q: `insert into links(user_id, website, link) values(${id}, "${link.website}", "${link.url}")`}];
    const linkSubmissionResponse = await fetch(databaseUrl, {
        ...config,
        body: JSON.stringify({statements: linkSubmitStatements}),
    });
    const linkSubmissionJsonResponse = await linkSubmissionResponse.json();
  }

  return Response.json({
    success: true,
    message: "Links added!",
    username: username,
  });
};

export const config: Config = {path: "/submit-user-data"}