# The Mug Store! 🍵

An e-commerce store built with [Remix], [Turso], [Drizzle], and [Hydrogen].

- [Remix Docs]
- [Turso Docs]
- [Drizzle Docs]
- [Hydrogen Docs]

## Development

You will be running two processes during development:

- The Miniflare server (miniflare is a local environment for Cloudflare Workers)
- The Remix development server

Both are started with one command:

```sh
npm run dev
```

Open up [http://127.0.0.1:8787] and you should be ready to go!

If you want to check the production build, you can stop the dev server and run
following commands:

```sh
npm run build
npm start
```

Then refresh the same URL in your browser (no live reload for production
builds).

# Database Setup

[Install the Turso CLI].

Create a new turso database.

```sh
turso db create the-mug-store
```

> **Note**
>
> We use `the-mug-store` as the database name in this command, but you can give
> it any name.

Access the database through the Turso CLI shell.

```sh
turso db shell the-mug-store
```

## Set up Turso

To access the data stored inside your database, you need the Turso database url
and an authentication token.

To obtain the database url, run the following command:

```sh
turso db show the-mug-store --url
```

And, to create an authentication token for your database, run:

```sh
turso db tokens create the-mug-store
```

### For local development

Add a `.dev.env` file at the root of the project and inside it add the authentication token for your Turso
database.

```
TURSO_DB_AUTH_TOKEN=<AUTH-TOKEN>
```

Add a `[vars]` section on the `wrangler.toml` file add the database url as follows.

```
[vars]
  TURSO_DB_URL = <DB-URL>
```

Add another `.env` file with the following variables, populating them with the
values obtained above. This will assist with drizzle schema generation when
developing locally.

```
TURSO_DB_AUTH_TOKEN=
TURSO_DB_URL=
```

> **Note**
>
> Do not stage the `.dev.env` and `.env` files used in local development.

### For the production environment

Run `npx wrangler secret put TURSO_DB_AUTH_TOKEN` and paste the authentication
token obtained above.

For the database url, run `npx wrangler secret put TURSO_DB_URL` and paste the database url obtained above.

```
[vars]
  TURSO_DB_URL = <DB-URL>
```

## Schema generation and migration

To generate the database schema with Drizzle, run:

```sh
pnpm generate
```

Migrate the generated data schema by running:

```sh
pnpm migrate
```

TO optionally seed sample data into the database, run.

```sh
pnpm seed
```

## Deployment

If you don't already have an account, then [create a cloudflare account here]
and after verifying your email address with Cloudflare, go to your dashboard and
set up your free custom Cloudflare Workers subdomain.

Once that's done, you should be able to deploy your app:

```sh
npm run deploy
```

[Remix]: https://github.com/remix-run/remix
[Turso]: htthhttps://turso.tech/
[Drizzle]: https://github.com/drizzle-team/drizzle-orm
[Hydrogen]: https://github.com/Shopify/hydrogen
[Remix Docs]: https://remix.run/docs
[Turso Docs]: https://docs.turso.tech/
[Drizzle Docs]: https://orm.drizzle.team/
[Hydrogen Docs]: https://shopify.dev/docs/custom-storefronts/hydrogen
[Install the Turso CLI]: https://docs.turso.tech/reference/turso-cli#installation
[http://127.0.0.1:8787]: http://127.0.0.1:8787
[create a cloudflare account here]: https://dash.cloudflare.com/sign-up
