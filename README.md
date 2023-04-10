# Top Web Frameworks

A website listing top web frameworks made with [Nuxt] and [Turso].

## Technologies used

- [Nuxt 3]
- [Turso]

---

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
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

This project is using [Nuxt], the intuitive web framework.

Inside your project, you'll see the following directory structure:

```
├── composables
│   └── use-turso.js
├── layouts
│   └── default.vue
└── pages/
│   ├── about.vue
│   ├── add-new.vue
│   └── index.vue
├── server
│   ├── api
│   │   ├── add.js
│   │   └── frameworks.js
│   └── utils
│       └── responseDataAdapter.js
```

- `src/pages`: Houses the file-based routing files, using the layout files under `/layout`.
- The files under `/server/api`  are endpoints.

The helper functions under `/server/utils` are auto-imported into the endpoint files.

## Setting up the database

Install the Turso CLI.

```sh
# On macOS or Linux with Homebrew
brew install chiselstrike/tap/turso

# Manual scripted installation
curl -sSfL <https://get.tur.so/install.sh> | bash
```

Create a new turso database.

```sh
turso db create [DATABASE-NAME]
```

Access the database through the Turso CLI shell.

```sh
turso db shell [DATABASE-NAME]
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
	stars integer not nulld
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
insert into frameworks(name, language, url, stars) 
values("Vue".js , "JavaScript", "https://github.com/vuejs/vue", 203000),
("React", "JavaScript", "https://github.com/facebook/react", 206000),
("Angular", "TypeScript", "https://github.com/angular/angular", 87400),
("ASP.NET Core", "C#", "https://github.com/dotnet/aspnetcore", 31400),
("Express", "JavaScript", "https://github.com/expressjs/express", 60500),
("Django", "Python", "https://github.com/django/django", 69800),
("Ruby on Rails", "Ruby", "https://github.com/rails/rails", 52600),
("Spring", "Java", "https://github.com/spring-projects/spring-framework", 51400),
("Laravel", "PHP", "https://github.com/laravel/laravel", 73100),
("Flask", "Python", "https://github.com/pallets/flask", 62500),
("Ruby", "Ruby", "https://github.com/ruby/ruby", 41000),
("Symfony", "PHP", "https://github.com/symfony/symfony", 28200),
("CodeIgniter", "PHP", "https://github.com/bcit-ci/CodeIgniter", 18200),
("CakePHP", "PHP", "https://github.com/cakephp/cakephp", 8600),
("Qwik", "TypeScript", "https://github.com/BuilderIO/qwik", 16400);
```

### Set up Turso on the project

To access the data stored inside your database, you need the Turso database url and an authentication token.

To obtain the database url, run the following command:

```sh
turso db show [DATABASE-NAME] --url
```

And, to create an authentication token for your database, run:

```sh
turso db tokens create [DATABASE-NAME] --expiration none
```

> When the `–expiration` flag is set to `none` we are creating non-expiring tokens.

Add a `.env` file at the root of the project and inside it add the values obtained above as the database url and authentication token for your Turso database.

```txt
NUXT_TURSO_DB_URL=
NUXT_TURSO_DB_AUTH_TOKEN=
```

[Nuxt]: https://nuxt.com/
[Nuxt 3]: https://nuxt.com/
[Turso]: https://chiselstrike.com
[deployment documentation]: https://nuxt.com/docs/getting-started/deployment
