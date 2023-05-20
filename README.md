This is a [Next.js] starter template that uses [Turso] to store data and
[Tailwindcss] for styling.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000] with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page
auto-updates as you edit the file.

This project uses [`next/font`] to automatically optimize and load Inter, a
custom Google Font.

## Setting up the database

[Install the Turso CLI].

Create a new turso database.

```sh
turso db create web-frameworks
```

> We use `web-frameworks` as the database name in this command, but you can give
> it any name.

Access the database through the Turso CLI shell.

```sh
turso db shell web-frameworks
```

### Create tables and indexes

Here's the SQL statement to create the `frameworks` table.

```sql
-- create the "frameworks" table
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

And, to create an authentication token for your database, run:

```sh
turso db tokens create web-frameworks
```

Add a `.env.local` file at the root of the project and inside it add the values
obtained above as the database url and authentication token for your Turso
database.

```
NEXT_TURSO_DB_URL=
NEXT_TURSO_DB_AUTH_TOKEN=
```

## Learn More

To learn more about the stack used in this template, take a look at the
following resources:

- [Next.js Documentation] - learn about Next.js features and API.
- [Turso Documentation] - learn about Next.js features and API.
- [Turso Community] - Join the Turso community.
- [libSQL] - The open-source open-contribution fork of SQLite Turso is built on.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform] from
the creators of Next.js.

Check out the [Next.js deployment documentation] or [Turso's Vercel setup guide]
for more details.

[Next.js]: https://nextjs.org/
[Turso]: https://turso.tech
[Tailwindcss]: https://tailwindcss.com
[http://localhost:3000]: http://localhost:3000
[`next/font`]: https://nextjs.org/docs/basic-features/font-optimization
[Install the Turso CLI]:https://docs.turso.tech/reference/turso-cli#installation
[Next.js Documentation]: https://nextjs.org/docs
[Turso Documentation]: https://docs.turso.tech/
[Turso Community]: https://discord.com/invite/4B5D7hYwub
[Learn Next.js]: https://nextjs.org/learn
[libSQL]: https://github.com/libsql/libsql
[Vercel Platform]: https://vercel.com/new
[Next.js deployment documentation]: https://nextjs.org/docs/deployment
[Turso's Vercel setup guide]: https://docs.turso.tech/tutorials/vercel-setup-guide/