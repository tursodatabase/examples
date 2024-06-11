# Symfony - Rest API CRUD

Build with:
- [Symfony](https://laravel.com/)
- 🔥 up with [Turso Doctrine DBAL](https://github.com/tursodatabase/turso-doctrine-dbal)

With **[libSQL Native Extension / Turso Client PHP](https://github.com/tursodatabase/turso-client-php)** for PHP install and configured in PHP Environment.

## 🚨 The Extension is Required 🚨

### Download

Download the latest build extension/driver binary you can see at [Release](https://github.com/tursodatabase/turso-client-php/releases) page. It's available for:
- Linux
- Mac/Darwin
- Windows (still struggle, but you need to try use WSL)

### Installation

- 📦 Extract the archive
- 🗃 Locate somewhere in your machine
- 💽 Copy a relative path that address that extension/driver
- 📂 Open `php.ini` search `;extension` if you using nano (ctrl+w) then searching for it
- 📝 add in the next-line `extension=liblibsql_php.so` (in Linux) without `;` at the begining

Check on your console/terminal

```shell
$ php --m | grep libsql
liblibsql_php
```

Now, you can use `LibSQL` class in your PHP code!

---

---

## Database Setup

[Install Turso CLI](https://docs.turso.tech/reference/turso-cli#installation)

Create a new turso database.

```bash
turso db create symfony-rest-api-crud
```

> 💡 **Note**
>
> We use `symfony-rest-api-crud` as the database name in this command, but you can give it any name.

To access the data stored inside your database, you need the Turso database url and an authentication token.

To obtain the database url, run the following command:

```bash
turso db show symfony-rest-api-crud --url
```

And, to create an authentication token for your database, run:

```bash
turso db tokens create symfony-rest-api-crud
```

Add a `.env` file with the following variables, populating them with the values obtained above. Here we will use Remote Connection

```bash
DATABASE_URL="sqlite:///%kernel.project_dir%/data/database.db"
TURSO_AUTH_TOKEN=
TURSO_DB_URL=
```

Add a `.env` file with the following variables, populating them with the values obtained above.

## Doctrine DBAL Setup

**Default connection for this example is using Remote Connection**, see `config/packages/doctrine.yaml`:

```yaml
doctrine:
    dbal:
        # --- TURSO CONFIGURATION PART ---
        path: '%env(resolve:DATABASE_URL)%'
        driver_class: \Turso\Doctrine\DBAL\Driver
        options:
            auth_token: "%env(TURSO_AUTH_TOKEN)%"
            sync_url: "%env(TURSO_DB_URL)%"
            use_framework: true                     # required
        # --- TURSO CONFIGURATION PART ---
        server_version: '1.2.0'
        profiling_collect_backtrace: '%kernel.debug%'
        use_savepoints: true
```

to use **Embedded Replica** make sure you have fresh database setup and modify the `config/packages/doctrine.yaml`:

```yaml
doctrine:
    dbal:
        # --- TURSO CONFIGURATION PART ---
        path: '%env(resolve:DATABASE_URL)%'
        driver_class: \Turso\Doctrine\DBAL\Driver
        options:
            url: '%env(resolve:DATABASE_URL)%'      # Embedded Replica - Required
            auth_token: "%env(TURSO_AUTH_TOKEN)%"
            sync_url: "%env(TURSO_DB_URL)%"
            use_framework: true                     # required
        # --- TURSO CONFIGURATION PART ---
        server_version: '1.2.0'
        profiling_collect_backtrace: '%kernel.debug%'
        use_savepoints: true
```

> Note to use `sync()` method, called via `$entityManager->getConnection()->getNativeConnection()->sync()`

to use Local Connection here the setup `config/packages/doctrine.yaml`:

```yaml
doctrine:
    dbal:
        # --- TURSO CONFIGURATION PART ---
        path: '%env(resolve:DATABASE_URL)%'
        driver_class: \Turso\Doctrine\DBAL\Driver
        options:
            use_framework: true                     # required
        # --- TURSO CONFIGURATION PART ---
        server_version: '1.2.0'
        profiling_collect_backtrace: '%kernel.debug%'
        use_savepoints: true
```

to use In-Memory Connection here the setup `config/packages/doctrine.yaml`:

```yaml
doctrine:
    dbal:
        # --- TURSO CONFIGURATION PART ---
        memory: true
        driver_class: \Turso\Doctrine\DBAL\Driver
        options:
            use_framework: true                     # required
        # --- TURSO CONFIGURATION PART ---
        server_version: '1.2.0'
        profiling_collect_backtrace: '%kernel.debug%'
        use_savepoints: true
```

## Developing

```bash
# Install dependencies
composer install

# Create doctrine shema
php bin/console doctrine:schema:create

# or
symfony console doctrine:schema:create
```

## Start Server

```bash
symfony serve
```

Now, you can view the application at http://127.0.0.1:8000

---

If you found something wrong with this example project feel free to report at 