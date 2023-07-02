import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.NUXT_TURSO_DB_URL as string,
  authToken: process.env.NUXT_TURSO_DB_AUTH_TOKEN as string,
});

async function main() {
  await client.execute(
    "create table if not exists frameworks (id integer primary key,name varchar (50) not null,language varchar (50) not null,url text not null,stars integer not null)"
  );
  console.log("Migrated db!");

  const statements = [
    "create table if not exists frameworks (id integer primary key,name varchar (50) not null,language varchar (50) not null,url text not null,stars integer not null)",
    "delete from frameworks",
    {
      sql: "insert into frameworks(name, language, url, stars) values(?, ?, ?, ?)",
      args: ["Vue.js", "JavaScript", "https://github.com/vuejs/vue", 2000],
    },
    {
      sql: "insert into frameworks(name, language, url, stars) values(?, ?, ?, ?)",
      args: ["React", "JavaScript", "https://github.com/facebook/react", 2000],
    },
    {
      sql: "insert into frameworks(name, language, url, stars) values(?, ?, ?, ?)",
      args: [
        "Angular",
        "TypeScript",
        "https://github.com/angular/angular",
        87400,
      ],
    },
    {
      sql: "insert into frameworks(name, language, url, stars) values(?, ?, ?, ?)",
      args: ["ASP.NET Core", "C#", "https://github.com/dotnet/aspnetcore", 300],
    },
    {
      sql: "insert into frameworks(name, language, url, stars) values(?, ?, ?, ?)",
      args: [
        "Express",
        "JavaScript",
        "https://github.com/expressjs/express",
        500,
      ],
    },
  ];

  statements.forEach(async (statement) => {
    await client.execute(statement);
  });

  console.log("Seeded db");
}

main().catch(console.log);
