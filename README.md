# FindMeOn ⚡️

A social links listing app built with [Flask], [HTMX], and [Turso].

## Technologies used

- [Turso]
- [Flask]
- [HTMX]
- [TailwindCSS]

---

## Project Structure

This project is using Flask as the back-end and HTMX as the front-end.

Inside your project, you'll see the following directory structure:
templates/404.html templates/base.html templates/icons.html templates/index.html templates/username.html

```bash
├── templates/
│   └── 404.html
│   └── base.html
│   └── icons.html
│   └── index.html
│   └── username.html
└── app.py
└── models.py
```

- `/templates`: Here is where our app's templates reside.

- `app.py`: This is where our Flask app & route source code lives.

- `models.py`: Here are where our database models reside.

## Install dependencies

Create and activate a [virtual environment].

```bash
# create virtual environment
# MacOS/Linux
python3 -m venv .venv
# Windows
py -3 -m venv .venv

# activate virtual environment
# MacOS/Linux
.venv/bin/activate
# Windows
.venv\Scripts\activate
```

Install Flask and other project dependencies.

```bash
(.venv) pip install Flask python-dotenv Flask-Assets
```

Install TailwindCSS and download its binary.

```bash
(.venv) pip install pytailwindcss
(.venv) tailwindcss
```

[Install SQLAlchemy and its LibSQL dialect].

```bash
(.venv) pip install sqlalchemy-libsql
```

## Setting up the database

[Install the Turso CLI].

Create a new turso database.

```sh
turso db create find-me-on
```

Create a ".env" file at the root of the project, this is where our database
credentials will be stored.

Get the database url.

```sh
turso db show --url find-me-on
```

Assign the database url to the "TURSO_DB_URL" key inside the ".env" file.

```txt
TURSO_DB_URL=<obtained-db-url>
```

Create a database authentication token.

```sh
turso db tokens create find-me-on-fh
```

Assign the database authentication token to the "TURSO_DB_AUTH_TOKEN" key inside
the ".env" file.

```txt
TURSO_DB_AUTH_TOKEN=<obtained-db-auth-token>
```

## Run the development server

```bash
python3 app.py
```

> **Note**
>
> You can opt to visit the "127.0.0.1:5000/seed" route to seed one account whose
> information can be viewed by visiting "127.0.0.1:5000/seed" afterwards.

[Flask]: https://flask.palletsprojects.com/
[HTMX]: https://htmx.org/
[Turso]: https://turso.tech
[TailwindCSS]: https://tailwindcss.com
[virtual environment]: https://flask.palletsprojects.com/en/2.3.x/installation/#virtual-environments
[Install SQLAlchemy and its LibSQL dialect]: https://github.com/libsql/sqlalchemy-libsql#co-requisites
[Install the Turso CLI]: https://docs.turso.tech/reference/turso-cli#installation
