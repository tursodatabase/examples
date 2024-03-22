# Expenses Tracker

A personal expenses tracking application built with [Elysia](https://elysiajs.com/), [Bun](https://bun.sh/), and Turso's [Embedded Replicas](https://docs.turso.tech/features/embedded-replicas).

## Getting Started

Create a turso database.

```sh
turso db create <db-name>
```

Get the database credentials:

```sh
# db url
turso db show --url <db-name>

# authentication token
turso db tokens create <db-name>
```

Rename `.env.example` to `.env` and update the database credentials with the values obtained above.

```text
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

Install the project's dependencies:

```bash
bun install
```

## Development

To start the development server run:

```bash
bun run dev
```

## Sending Requests

Add a new expense:

```sh
curl "http://127.0.0.1:$PORT/records" \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"ammount": 200,"information": "Bought something nice!"}'
```

Get all expenses:

```sh
curl "http://127.0.0.1:$PORT/records"
```

> [!Note]
> Info The `$PORT` above is the value you used in the `PORT` key inside the `.env` file.
