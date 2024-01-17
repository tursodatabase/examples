# TurQw Store ⚡️

A shopping cart built with Qwik and Turso

- [Turso Docs]
- [Turso Discord]
- [@tursodatabase]
- [Qwik Docs]
- [Discord]
- [Qwik GitHub]

---

## Project Structure

This project is using Qwik with
[QwikCity]. QwikCity is just an
extra set of tools on top of Qwik to make it easier to build a full site,
including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory based routing, which can include a
  hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page.
  Additionally, `index.ts` files are endpoints. Please see the [routing
docs] for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public
  directory. Please see the [Vite public
  directory] for more
  info.

## Add Integrations and deployment

Use the `npm run qwik add` command to add additional integrations. Some examples of
integrations include: Cloudflare, Netlify or Express server, and the [Static
Site Generator
(SSG)].

```shell
npm run qwik add # or `yarn qwik add`
```

## Development

Development mode uses [Vite's development server]. During
development, the `dev` command will server-side render (SSR) the output.

```shell
npm start # or `yarn start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files.
> This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a
production build of `src/entry.preview.tsx`, and run a local server. The preview
server is only for convenience to locally preview a production build, and it
should not be used as a production server.

```shell
npm run preview # or `yarn preview`
```

## Production

The production build will generate client and server modules by running both
client and server build commands. Additionally, the build command will use
Typescript to run a type check on the source code.

```shell
npm run build # or `yarn build`
```

## Set up the database

[Install the Turso CLI].

Create a new turso database.

```sh
turso db create app-turqw-store
```

> We use `app-turqw-store` as the database name in this command, but you can
> give it any name.

Access the database through the Turso CLI shell.

```sh
turso db shell app-turqw-store
```

Issue the following statements to prepate the database's tables, indexes, and
seed some data.

```sql
-- category table
create table categories(
    id varchar (30) primary key,
    name varchar (100) not null
);

create unique index idx_categories_id on categories(id);

-- products table
create table products(
    id varchar (30) primary key,
    name varchar (100) not null,
    description text, price integer not null,
    category_id text not null,
    image text not null,
    created_at integer default (cast (unixepoch () as int)),
    foreign key (category_id) references categories (id)
);

create unique index idx_products_id on products(id);
create index idx_products_price on products(price);
create index idx_products_category_id on products(category_id);

-- users table
create table users(
    id integer primary key,
    first_name varchar (100) not null,
    last_name varchar (100) not null,
    email text not null,
    address text,
    avatar text not null,
    created_at integer default (cast (unixepoch () as int))
);

create unique index idx_users_email on users(email);
create index idx_users_first_name_last_name_address on users(first_name, last_name, address);

-- carts table
create table cart_items(
    id integer primary key,
    user_id integer not null,
    product_id varchar(30) not null,
    count integer not null default 1,
    created_at integer default (cast (unixepoch () as int)),

    foreign key (user_id) references users (id),
    foreign key (product_id) references products (id)
);

create unique index idx_cart_items_user_id_product_id on cart_items(user_id, product_id);
create index idx_cart_items_product_id on cart_items(product_id);

-- wishlists table
create table wishlists(
    id integer primary key,
    user_id integer not null,
    product_id varchar(30) not null,
    count integer not null default 1,
    created_at integer default (cast (unixepoch () as int)),

    foreign key (user_id) references users (id),
    foreign key (product_id) references products (id)
);

create unique index idx_wishlists_user_id_product_id on wishlists(user_id, product_id);
create index idx_wishlists_product_id on wishlists(product_id);

-- orders table
create table orders(
    id integer primary key,
    user_id integer,
    customer_name varchar(100) not null,
    amount integer not null,
    shipping_fees integer default 0 not null,
    discount_amt integer default 0 not null,
    final_amount integer not null,
    shipping_address text not null,
    paid boolean default false,
    created_at integer default (cast (unixepoch () as int))
);

create index idx_orders_user_id on orders(user_id);
create index idx_cartitems_paid on orders(paid);

-- order items table
create table order_items(
    id integer primary key,
    order_id integer not null,
    product_id varchar(30) not null,
    count integer default 1 not null,
    created_at integer default (cast (unixepoch () as int)),

    foreign key (order_id) references orders (id),
    foreign key (product_id) references products (id)
);

create unique index idx_order_items_order_id_product_id on order_items(order_id, product_id);
create index idx_order_items_product_id on order_items(product_id);

-- seed some data
insert into users(first_name, last_name, email, address, avatar) values("Iku", "Turso", "turso@iku.mail", "Salt water swamp", "https://res.cloudinary.com/djx5h4cjt/image/upload/chiselstrike-assets/Turso-Symbol-Blue.jpg");
```

### Seeding data

The project contains some seeding files under the `/seed` directory. You can opt to delete them afterwards.

Run `node ./seed/index.js` to seed some categories and products data into the
database.

### Set up Turso on the project

To access the data stored inside your database, you need the Turso database url
and an authentication token.

To obtain the database url, run the following command:

```sh
turso db show app-turqw-store --url
```

And, to create an authentication token for your database, run:

```sh
turso db tokens create app-turqw-store
```

Add a .env file at the root of the project and inside it add the values obtained
above as the database url and authentication token for your Turso database.

```sh
VITE_TURSO_DB_URL=
VITE_TURSO_DB_AUTH_TOKEN=
```


[Turso Docs]:https://docs.turso.tech/
[Turso Discord]:https://docs.turso.tech/
[@tursodatabase]:https://twitter.com/tursodatabase
[Qwik Docs]:https://qwik.builder.io/
[Discord]:https://qwik.builder.io/chat
[Qwik GitHub]:https://github.com/BuilderIO/qwik
[QwikCity]:https://qwik.builder.io/qwikcity/overview/
[routing docs]:https://qwik.builder.io/qwikcity/routing/overview/
[Vite public directory]:https://vitejs.dev/guide/assets.html#the-public-directory
[Static Site Generator (SSG)]:https://qwik.builder.io/qwikcity/guides/static-site-generation/
[Vite's development server]:https://vitejs.dev/
[Install the Turso CLI]:https://docs.turso.tech/reference/turso-cli#installation