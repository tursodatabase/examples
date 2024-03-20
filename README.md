# Web Traffic Checker

A simple web traffic checking API featuring [Turso embedded replicas](https://docs.turso.tech/features/embedded-replicas) and [Actix](https://github.com/actix/actix-web).

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

Rename `.env.example` to `.env` and update the database credentials:

```text
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

## Run project

```sh
mkdir -p db && cargo run
```

Run migrations:

```sh
curl "http://127.0.0.1:$PORT"
```

Add a new hit:

```sh
curl "http://127.0.0.1:$PORT/record" \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{"title": "About","link": "about-page"}'
```

Get traffic analytics for a page:

```sh
curl "http://127.0.0.1:$PORT/hits?link=about-page"
```

> [!Note]
> Info The `$PORT` above is the value you used in the `PORT` key inside the `.env` file.
