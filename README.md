# Astro + Turso Starter Kit: SSR Blog

```
npm create astro@latest -- --template blog
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/blog)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/turso-extended/app-tustro-blog)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/turso-extended/app-tustro-blog?devcontainer_path=.devcontainer/blog/devcontainer.json)

![blog](https://res.cloudinary.com/djx5h4cjt/image/upload/q_auto:eco/v1681856953/chiselstrike-assets/Hero_-_Blog_with_Turso_and_Astro.jpg)

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## SSR configuration

This blog comes with the Netlify SSR adapter, if you want to deploy with other
services, please install [make the required changes].

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page
is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put
any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |

> Before deployment, make sure to change the `site` value in `astro.config.mjs` to that of your production domain .

## Setting up the database

[Install the Turso CLI].

```sh
# On macOS or Linux with Homebrew
brew install chiselstrike/tap/turso

# Manual scripted installation
curl -sSfL <https://get.tur.so/install.sh> | bash
```

Create a new turso database.

```sh
turso db create [DATABASE-NAME]
```

Access the database through the Turso CLI shell.

```sh
turso db shell [DATABASE-NAME]
```

### Create tables and indexes

Here are the SQL statements set up Turso for the blog.

```sql
-- create an authors table
create table authors(
	id integer primary key,
	first_name varchar(20) not null,
	last_name varchar(20) not null,
	slug varchar(50) not null,
	email text not null,
	avatar text,
	twitter text,
	website text,
	created_at integer default (cast(unixepoch() as int))
);

-- create indexes for the authors table
create unique index idx_authors_id on authors(id);
create unique index idx_authors_slug on authors(slug);

-- create a posts table
create table posts(
  id integer primary key,
  title varchar(100),
	description text,
  slug varchar(100),
  content text,
	hero text,
  author_id integer not null,
	tags text,
  created_at integer default (cast(unixepoch() as int)),
  published_date integer,
  published boolean default false,

	foreign key (author_id) references authors(id)
);

-- create the posts table's indexes
create unique index idx_posts_id on posts(id);
create unique index idx_posts_slug on posts(slug);
create index idx_posts_title on posts(title);
create index idx_posts_published on posts(published);
```

Run these statements to seed some initial blog data into the database.

```sql
-- seed some data
insert into authors (
	first_name, last_name, slug, email, twitter, avatar
) values ( "Iku", "Turso", "iku-turso", "noreply@ikuturso.tech", "https://twitter.com/tursodatabase", "https://res.cloudinary.com/djx5h4cjt/image/upload/v1681753493/chiselstrike-assets/Turso-Symbol-Blue.jpg");

insert into posts(
	title, description, slug, content, hero, author_id, tags, published
) values (
	"Deploying a web app built with Qwik and Turso on Netlify",
	"Unless we are tweaking around or playing with new tech for the sake of learning, most times we are working on products that we ultimately would like to share with the rest of the world. In such scenarios, services such as Netlify are among the household names when it comes to hosting projects for the web.",
	"deploying-a-web-app-built-with-qwik-and-turso-on-netlify",
	"# Why deploy apps
Unless we are tweaking around or playing with new tech for the sake of learning, most times we are working on products that we ultimately would like to share with the rest of the world.
In such scenarios, services such as Netlify are among the household names when it comes to hosting projects for the web.

## What does Netlify offer
Netlify lets developers skip DevOps and set up projects globally in a production-ready, rollback-supporting, and scalable environment.",
"https://miro.medium.com/v2/resize:fit:1400/format:webp/1*nAgUNVqTjw0BZtsOlAbIpA.png",
1, "devops, netlify, turso, qwik", true

);
insert into posts(
	title, description, slug, content, hero, author_id, tags, published
) values (
	"Turso CLI is now open source",
	"Turso is an database for the edge, which is why it departs from how most databases operate. First and foremost, Turso works both locally and remotely by relying on libSQL, our fork of SQLite.",
	"turso-cli-is-now-open-source",
	"# Turso, the databse for the edge 
Turso is an database for the edge, which is why it departs from how most databases operate.

## Turso works both locally and remotely
First and foremost, Turso works both locally and remotely by relying on [libSQL](http://github.com/libsql/libsql), our fork of SQLite.
When working remotely, the database is accessed through HTTP and WebSockets, as opposed to a traditional TCP-based wire protocols, which makes Turso accessible from almost any environment, including edge functions.",
"https://miro.medium.com/v2/resize:fit:1400/format:webp/1*YPvsd-V0-KAIbJbVuCaMdQ.png",
1, "open-source, turso", true
);
```

---

## 👀 Want to learn more?

- Check out the [Astro documentation] or jump into the [Astro Discord server].
- Check out the [Turso documentation] or jump into the [Turso Discord server].

## Credit

This theme is based off of the lovely [Bear Blog].

[make the required changes]: https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project
[Astro documentation]: https://docs.astro.build
[Astro Discord server]: https://astro.build/chat
[Turso documentation]: https://docs.turso.tech
[Turso Discord server]: https://discord.com/invite/4B5D7hYwub
[Bear Blog]: https://github.com/HermanMartinus/bearblog/
[Install the Turso CLI]:https://docs.turso.tech/reference/turso-cli#installation