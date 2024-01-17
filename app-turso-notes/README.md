# Turso Notes ⚡️

A multi-platform note-taking desktop application built with [Tauri], [Turso], [Qwik], and [TailwindCSS].

## Prerequisites

- [Node.js v16.8] or higher.

- Rust installed in your machine.

- Platform specific system dependencies to develop Tauri apps:
  - [Windows]
  - [MacOs]
  - [Linux]

## Database Setup

[Install the Turso CLI].

Create a new turso database.

```sh
turso db create turso-notes
```

Get the database URL.

```sh
turso db show turso-notes --url
```

Create an authentication token for your database.

```sh
turso db tokens create turso-notes
```

Create a .env file inside `/src-tauri` adding the acquired values from the two commands above as environment variables.

```toml
# /src-tauri/.env

TURSO_SYNC_URL=<OBTAINED_URL>
TURSO_TOKEN=<CREATED_TOKEN>
```

Add a `DB_PATH` key with the path to the local SQLite database (embedded replica) that this app is going to sync with Turso and perform reads on. (Turso will automatically create the file database on first run)

```toml
# /src-tauri/.env

DB_PATH=../turso-notes.db
```

Open the created Turso database on the Turso CLI shell to issue SQLite statements:

```sh
turso db shell turso-notes.
```

On the Turso CLI shell, issue the following statement to create a "notes" table.

```sql
create table notes(
 id varchar not null,
 title varchar not null,
 `text` text default ('Write something here...'),
 created_at integer default (cast(unixepoch() as int)),
 updated_at integer default (cast(unixepoch() as int))
);
```

## Development

Install project's dependencies.

```sh
npm install
```

Run the following command to run a development preview of the application.

```sh
cargo tauri dev
```

[Install the Turso CLI]: https://docs.turso.tech/reference/turso-cli#installation
[Node.js v16.8]: https://nodejs.org/en/download/
[Tauri]: https://tauri.app
[Windows]: https://tauri.app/v1/guides/getting-started/prerequisites#setting-up-windows
[MacOs]: https://tauri.app/v1/guides/getting-started/prerequisites#setting-up-macos
[Linux]: https://tauri.app/v1/guides/getting-started/prerequisites#setting-up-linux
[Turso]: https://turso.tech
[Qwik]: https://qwik.builder.io
[TailwindCSS]: https://tailwindcss.com
