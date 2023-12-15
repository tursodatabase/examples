# Flutter Todo List

A quickstart todo application built with Flutter and Turso.

**Prerequisites**

- The [Turso CLI] installed and signed in.
- [Flutter] installed in your machine.

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
    task TEXT NOT NULL,
);
```

Populate the `todos` table with some data and exit the shell.

```sql
INSERT INTO todos values ("Go to the gym");
INSERT INTO todos values ("Watch a movie");
INSERT INTO todos values ("Write some code");

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

## Development

Run the app in development passing the obtained database credentials.

```sh
flutter run --debug --dart-define=TURSO_URL=[database-url] --dart-define=TURSO_AUTH_TOKEN=[database-auth-token]
```


## More resources

For more information and guidance using the two technologies in this quickstart visit the following links:

- [Turso documentation]
- [Flutter documentation]

[Turso CLI]: https://docs.turso.tech/reference/turso-cli
[Flutter]: https://flutter.dev
[Turso documentation]: https://docs.turso.tech
[Flutter documentation]: https://docs.flutter.dev