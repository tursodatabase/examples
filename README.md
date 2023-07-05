# Top Web Frameworks

A website listing top web frameworks made with [Nuxt] and [Turso].

## Technologies used

- [Nuxt]
- [Turso]
- [TailwindCSS]

---

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation] for more information.

---

## Project Structure

This project is using [Nuxt](https://nuxt.com), the intuitive Vue framework.

Inside your project, you'll see the following directory structure:

```
└── pages/
│   ├── about.vue
│   ├── add-new.vue
│   └── index.vue
├── server
│   ├── api
│   │   ├── add.post.ts
│   │   └── frameworks.get.ts
│   └── utils
│       └── turso.ts
│── app.vue
```

- `src/pages`: Houses the file-based routing files
- `app.vue` is the main layout of the app
- The files under `/server/api` are endpoints.

The helper functions under `/server/utils` are auto-imported into the endpoint
files.

## Setting up the database

[Install the Turso CLI].

Create a new turso database.

```sh
turso db create web-frameworks
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

Add a `.env` file at the root of the project and inside it add the values
obtained above as the database url and authentication token for your Turso
database.

```txt
NUXT_TURSO_DB_URL=
NUXT_TURSO_DB_AUTH_TOKEN=
```

### Create tables and indexes

> **Note**
>
> You can run `npm run migrate:dev` and skip this step. Otherwise, proceed to
> experience working within the Turso CLI shell.

First, access the database through the Turso CLI shell.

```sh
turso db shell web-frameworks
```

Next, run the following SQL statement to create the `frameworks` table.

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

---

To clone and deploy this project to Vercel, click on the button below.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fturso-extended%2Fapp-top-web-frameworks&env=NUXT_TURSO_DB_URL,NUXT_TURSO_DB_AUTH_TOKEN)

[Nuxt]: https://nuxt.com/
[Turso]: https://chiselstrike.com
[TailwindCSS]: https://tailwindcss.com
[deployment documentation]: https://nuxt.com/docs/getting-started/deployment
[Install the Turso CLI]:https://docs.turso.tech/reference/turso-cli#installation