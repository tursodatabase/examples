# Mylinks ⚡️

A social links listing app built with [Qwik] and [Turso].

## Technologies used

- [Qwik Docs]
- [Turso]

---

## Project Structure

This project is using Qwik with [QwikCity]. QwikCity is just a extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs] for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory] for more info.

## Add Integrations and deployment

Use the `pnpm qwik add` command to add additional integrations. Some examples of integrations include: Cloudflare, Netlify or Express server, and the [Static Site Generator (SSG)].

```shell
pnpm qwik add # or `yarn qwik add`
```

## Setting up the database

Install the Turso CLI.

```sh
# On Mac
brew install chiselstrike/tap/turso

# linux script
curl -sSfL https://get.tur.so/install.sh | bash
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

Here is the schema for the users table that we should create.

```sql
craete table users(
	id integer primary key,
	email varchar(255) not null,
	full_name varchar(100) not null,
	username varchar(50) not null,
	created_at integer default (cast(iunixepoch() as int))
);
```

And, the links table’s sql is as follows.

```sql
craete table links(
	id integer primary key,
	user_id integer not null,
	website varchar(100) not null,
	link text not null,
	created_at integer default (cast(iunixepoch() as int)),

	foreign key user_id references users(id)
);
```

For fast data retrieval, accompanying indexes should also be set up for the two tables.

For the `users` table we need the `username` to be both a unique and an indexed column, since we do not want users to have identical usernames and because we'll be querying the table using this column as a filter repeatedly. The `email` column should also be a unique index as we do not want users to have identical emails.

So create unique indexes of these two colums as follows.

```sql
-- unique index for the email row
create unique index idx_users_email on users(email)

-- unique index for the username row
create unique index idx_users_username on users(username)
```

Likewise, for the `links` table, we do not want users to have duplicate social links, so we are going to create a multicolumn unique index for the `user_id` and `link` columns.

```sql
create unique index idx_links_userid_link on links(user_id, link)
```

### Set up Turso on the project

To access the data stored inside your database, you need the Turso database url and an authentication token.

To obtain the database url, run the following command:

```sh
turso db show [DATABASE-NAME] --url
```

And, to create an authentication token for your database, run:

```sh
turso db tokens create [DATABASE-NAME]
```

Add a `.env` file at the root of the project and inside it add the values obtained above as the database url and authentication token for your Turso database. Also, for some features of this project to function properly, add the base URL to your hosted app when in production, or the local url when developing locally.

```txt
TURSO_DB_URL=
TURSO_DB_AUTH_TOKEN=
VITE_BASE_URL=
```

[Qwik Docs]: https://qwik.builder.io/
[Turso]: https://chiselstrike.com
[QwikCity]: https://qwik.builder.io/qwikcity/overview/
[routing docs]: https://qwik.builder.io/qwikcity/routing/overview/
[Vite public directory]: https://vitejs.dev/guide/assets.html#the-public-directory
[Static Site Generator (SSG)]: https://qwik.builder.io/qwikcity/guides/static-site-generation/
