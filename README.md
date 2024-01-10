# My Recipe book

A recipe book mobile application built with Flutter and Turso

## Getting Started

### Database setup

Create new Turso database from the embedded SQLite file.

```
turso db create recipe-book --from-file recipe-book.db
```

Get the created database's credentials.

```bash
turso db show --url recipe-
turso db create tokens recipe-book
```

> [!NOTE]
> Replace the provided database URL's `libsql` protocol with `https` before using it to send HTTP requests.

## Development

```bash
flutter run --debug --dart-define=TURSO_URL=[db-url-with-https] --dart-define=TURSO_AUTH_TOKEN=[issued-auth-token]
```

## Application Screens

![Recipe book application presentation](assets/app-screens.png)

## References

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.