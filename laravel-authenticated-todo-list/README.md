# Laravel - S.S.A Todo-List

🔒 Authenticated Todo-List

Build with:
- [Laravel](https://laravel.com/)
- [Laravel Breeze](https://laravel.com/docs/11.x/starter-kits#laravel-breeze)
- [Liveware Volt](https://livewire.laravel.com/docs/volt) 
- also 🔥 up with [Turso Driver Laravel](https://github.com/tursodatabase/turso-driver-laravel)

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

## Database Setup

[Install Turso CLI](https://docs.turso.tech/reference/turso-cli#installation)

Create a new turso database.

```bash
turso db create laravel-todo-list
```

> 💡 **Note**
>
> We use `laravel-todo-list` as the database name in this command, but you can give it any name.

To access the data stored inside your database, you need the Turso database url and an authentication token.

To obtain the database url, run the following command:

```bash
turso db show laravel-todo-list --url
```

And, to create an authentication token for your database, run:

```bash
turso db tokens create laravel-todo-list
```

Add a `.env` file with the following variables, populating them with the values obtained above. Here we will use Remote Connection

```bash
DB_CONNECTION=libsql
DB_AUTH_TOKEN=
DB_SYNC_URL=
DB_REMOTE_ONLY=true
```

Add a `.env` file with the following variables, populating them with the values obtained above.

> 💡 Note
>
> For more detail about environment variable to set, see at [Turso Driver Laravel - Database Configuration](https://github.com/tursodatabase/turso-driver-laravel?tab=readme-ov-file#database-configuration)

## Create Migration & Seeders

Migrate the generated database schema by running:

```bash
php artisan migrate:fresh
```

To generate database seeders, run:

```bash
php artisan db:seed --class=DatabaseSeeder
```

By default, in this project we will generate 10 users using user factory.

## Developing

Once you've created a database, migrate the database, and create database seeders by following the instructions above, install the project's dependencies by running:

```bash
composer install
npm install
```

To start development server, run:

```bash
php artisan serve --port=6969
```

Open another terminal to compile the assets views:

```bash
npm run dev
```

Now, you can view the application at [http://127.0.0.1:6969](http://127.0.0.1:6969)