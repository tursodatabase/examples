# My Recipe Book

A recipe book application built with Quasar and SQLite.

## Technologies used

- [Quasar]
- [Express]
- [SQLite]
- [libSQL]

## Set up the database

> [!NOTE]  
> You can skip this step and use the SQLite database file that's already in this repo.

Create a new SQLite database at the root of this project using the [SQLite CLI].

```bash
sqlite3 recipe-book
```

Issue the following database schema.

```sql
CREATE TABLE IF NOT EXISTS recipes (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    nutrition_information TEXT,
    instructions TEXT,
    created_at INTEGER DEFAULT(CAST(UNIXEPOCH() AS INT)),
    updated_at INTEGER DEFAULT(CAST(UNIXEPOCH() AS INT))
);

CREATE TABLE IF NOT EXISTS ingredients (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    measurements VARCHAR NOT NULL,
    recipe_id VARCHAR NOT NULL,
    created_at INTEGER DEFAULT(CAST(UNIXEPOCH() AS INT)),
    updated_at INTEGER DEFAULT(CAST(UNIXEPOCH() AS INT)),

    FOREIGN KEY(recipe_id) REFERENCES recipes(id)
);

CREATE INDEX IF NOT EXISTS idx_recipe_name on recipes(name);
CREATE INDEX IF NOT EXISTS idx_ingredient_name on ingredients(name);
```

Quit the SQLite shell.

```bash
.quit
```

## Install the dependencies

```bash
yarn
# or
npm install
```

## Running the application

### Run the Express server.

```bash
npm run dev:db
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js].

[Quasar]: https://quasar.dev
[SQLite]: https://sqlite.org
[libSQL]: https://turso.tech/libsql
[Express]: https://expressjs.com/
[SQLite CLI]: https://sqlite.org/download.html
[Configuring quasar.config.js]: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js
