# Expenses Tracker w/Hono

A personal expenses tracking application built with [Hono](https://hono.dev/), [Bun](https://bun.sh/), and Turso.

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

## Running the project

To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000

## Sending Requests

Add a new expense:

```sh
curl "http://127.0.0.1:3000/records" \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"ammount": 200,"information": "Bought something nice!"}'
```

Get all expenses:

```sh
curl "http://127.0.0.1:3000/records"
```
