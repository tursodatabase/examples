# Turso + Axum

A simple example showing how to use [Turso](https://turso.tech) within the [Axum](https://github.com/tokio-rs/axum) framework.

## Development

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

Store the credentials inside a `.env` file:

```text
TURSO_DATABASE_URL
TURSO_AUTH_TOKEN
```

## Run project

```sh
cargo run
```

Add a new task:

```sh
curl "http://127.0.0.1:3000/todos" \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"task": "Do task m"}'
```

Get the list of added tasks:

```sh
curl "http://127.0.0.1:3000/todos"
```
