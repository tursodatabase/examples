# Workers-Turso TypeScript Demo

This is a demo project demonstrating the integration of Turso into a
Cloudflare Workers TypeScript/JavaScript project.

## prerequisites

- [A Cloudflare account].
- The [latest LTS version of Node.js] installed on your machine.
- The Cloudflare wrangler package: Install it by running - `npm install -g wrangler`.

## Project structure

```
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── index.test.ts
│   └── index.ts
├── tsconfig.json
└── wrangler.toml
```

## Setting up the database

[Install the Turso CLI].

Create a new turso database.

```sh
turso db create web-frameworks
```

> We use "web-frameworks" as the database name here, though you can use any
> database name of choice.

Access the database through the Turso CLI shell.

```sh
turso db shell web-frameworks
```

### Create database tables and indexes

Here's the SQL statement to create a `frameworks` table.

```sql
-- create a "frameworks" table
create table frameworks (
  id integer primary key,
  name varchar (50) not null,
  language varchar (50) not null,
  url text not null,
  stars integer not null
);
```

For unique column insertions, add accompanying unique indexes.

```sql
-- name column unique index
create unique index idx_frameworks_name ON frameworks (name);

-- url column unique index
create unique index idx_frameworks_url ON frameworks (url);
```

Seed the database with some data.

```sql
insert into frameworks(name, language, url, stars) values("Vue".js , "JavaScript", "https://github.com/vuejs/vue", 203000);
insert into frameworks(name, language, url, stars) values("React", "JavaScript", "https://github.com/facebook/react", 206000);
insert into frameworks(name, language, url, stars) values("Angular", "TypeScript", "https://github.com/angular/angular", 87400);
insert into frameworks(name, language, url, stars) values("ASP.NET Core", "C#", "https://github.com/dotnet/aspnetcore", 31400);
insert into frameworks(name, language, url, stars) values("Express", "JavaScript", "https://github.com/expressjs/express", 60500);
insert into frameworks(name, language, url, stars) values("Django", "Python", "https://github.com/django/django", 69800);
insert into frameworks(name, language, url, stars) values("Ruby on Rails", "Ruby", "https://github.com/rails/rails", 52600);
insert into frameworks(name, language, url, stars) values("Spring", "Java", "https://github.com/spring-projects/spring-framework", 51400);
insert into frameworks(name, language, url, stars) values("Laravel", "PHP", "https://github.com/laravel/laravel", 73100);
insert into frameworks(name, language, url, stars) values("Flask", "Python", "https://github.com/pallets/flask", 62500);
insert into frameworks(name, language, url, stars) values("Ruby", "Ruby", "https://github.com/ruby/ruby", 41000);
insert into frameworks(name, language, url, stars) values("Symfony", "PHP", "https://github.com/symfony/symfony", 28200);
insert into frameworks(name, language, url, stars) values("CodeIgniter", "PHP", "https://github.com/bcit-ci/CodeIgniter", 18200);
insert into frameworks(name, language, url, stars) values("CakePHP", "PHP", "https://github.com/cakephp/cakephp", 8600);
insert into frameworks(name, language, url, stars) values("Qwik", "TypeScript", "https://github.com/BuilderIO/qwik", 16400);
```

### Set up Turso on the project

To access the data stored inside your database, you need the Turso database url
and an authentication token.

To obtain the database url, run the following command:

```sh
turso db show web-frameworks --url
```

Add this environment secret to the Cloudflare Workers project by running the
following command on the project's root.

```sh
wrangler secret put TURSO_DB_URL
```

Copy the resulting URL from the previous Turso command and it when asked to
`Enter a secret value:`.

And, to create an authentication token for your database, run:

```sh
turso db tokens create web-frameworks
```

Again, add this environment secret to the Workers project by running the
following command.

```sh
wrangler secret put TURSO_DB_AUTH_TOKEN
```

Copy the resulting token from the previous Turso command and it when asked to
`Enter a secret value:`.

## Development

Run `npm install` to install the project's dependencies.

Run `npm run start` to authenticate this workers project with your Cloudflare
account and initiate the dev server.

[A Cloudflare account]:https://dash.cloudflare.com/sign-up/workers
[latest LTS version of Node.js]:https://nodejs.org/en/download
[Install the Turso CLI]:https://docs.turso.tech/reference/turso-cli#installation