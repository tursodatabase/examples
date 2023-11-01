# Turso CRM

A Customer Relationship Management (CRM) SaaS service built with [Remix], [Turso], and [Drizzle].

## Setting up the database

Create a turso database

```sh
turso db create turso-crm
```

Create an authentication token for all your databases

```sh
turso db tokens create turso-crm --group
```

Get the database URL for the created database

```sh
turso db show --url turso-crm
```

Store the acquired values as key value pairs in a .env file at the root of the project.

```toml
# .env

TURSO_URL=<OBTAINED_URL>
TURSO_AUTH_TOKEN=<CREATED_TOKEN>
```

Generate the database schema by running:

```sh
npm run drizzle:generate
```

Migrate the database schema by running:

```sh
npm run drizzle:migrate
```

- [Remix Docs](https://remix.run/docs)

## Local development

Install dependencies

```sh
npm install
```

Spin up a local server:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

[Remix]: https://remix.run
[Turso]: https://turso.tech
[Drizzle]: https://drizzle.team
