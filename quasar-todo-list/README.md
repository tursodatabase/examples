# Quasar Todo List (quasar-todo-list)

A todo list built with Quasar and Turso

**Prerequisites**

- The [Turso CLI] installed and signed in.

## Install the dependencies
```bash
yarn
# or
npm install
```

## Set up the database

Create a new Turso database.

```sh
turso db create my-todo-list
```

Access the Turso shell,

```sh
turso db shell my-todo-list
```

then issue the database schema.

```sh
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY,
    task TEXT NOT NULL
);
```

Populate the `todos` table with some data and exit the shell.

```sql
INSERT INTO todos values (1, "Go to the gym");
INSERT INTO todos values (2, "Watch a movie");
INSERT INTO todos values (3, "Write some code");

.quit -- exit the shell
```

Get the database URL.

```sh
turso db show --url my-todo-list
```

Create an auth token.

```sh
turso db tokens create my-todo-list
```

Rename `.env.example` to `.env.local` and populate the env variables with the acquired database credentials.

```txt
VITE_TURSO_URL=[issued-db-url]
VITE_TURSO_AUTH_TOKEN=[issued-auth-token]
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js].

[Turso CLI]: https://docs.turso.tech/reference/turso-cli
[Turso documentation]: https://docs.turso.tech
[Configuring quasar.config.js]: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js