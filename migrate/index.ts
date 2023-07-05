import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.NUXT_TURSO_DB_URL as string,
  authToken: process.env.NUXT_TURSO_DB_AUTH_TOKEN as string,
});

const frameworks = [
  ["Vue.js", "JavaScript", "https://github.com/vuejs/vue", 203000],
  ["React", "JavaScript", "https://github.com/facebook/react", 206000],
  ["Angular", "TypeScript", "https://github.com/angular/angular", 87400],
  ["ASP.NET Core", "C#", "https://github.com/dotnet/aspnetcore", 31400],
  ["Express", "JavaScript", "https://github.com/expressjs/express", 60500],
  ["Django", "Python", "https://github.com/django/django", 69800],
  ["Ruby on Rails", "Ruby", "https://github.com/rails/rails", 52600],
  [
    "Spring",
    "Java",
    "https://github.com/spring-projects/spring-framework",
    51400,
  ],
  ["Laravel", "PHP", "https://github.com/laravel/laravel", 73100],
  ["Flask", "Python", "https://github.com/pallets/flask", 62500],
  ["Ruby", "Ruby", "https://github.com/ruby/ruby", 41000],
  ["Symfony", "PHP", "https://github.com/symfony/symfony", 28200],
  ["CodeIgniter", "PHP", "https://github.com/bcit-ci/CodeIgniter", 18200],
  ["CakePHP", "PHP", "https://github.com/cakephp/cakephp", 8600],
  ["Qwik", "TypeScript", "https://github.com/BuilderIO/qwik", 16400],
];

async function main() {
  await client.execute(
    "create table if not exists frameworks (id integer primary key,name varchar (50) not null,language varchar (50) not null,url text not null,stars integer not null)"
  );
  console.log("Migrated db!");

  const statements = [
    "create table if not exists frameworks (id integer primary key,name varchar (50) not null,language varchar (50) not null,url text not null,stars integer not null)",
    "delete from frameworks",
    ...frameworks.map((framework) => ({
      sql: "insert into frameworks(name, language, url, stars) values(?, ?, ?, ?)",
      args: framework,
    })),
  ];

  await client.batch("write", statements);

  console.log("Seeded db");
}

main().catch(console.log);
