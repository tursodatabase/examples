# Mylinks ⚡️

A social links listing app built with [Qwik] and [Turso].

## Technologies used

- [Qwik Docs]
- [Turso]

---

## Project Structure

This project is using Qwik with [QwikCity]. QwikCity is just a extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

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

- `src/routes`: Provides the directory based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs] for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory] for more info.

## Add Integrations and deployment

Use the `pnpm qwik add` command to add additional integrations. Some examples of integrations include: Cloudflare, Netlify or Express server, and the [Static Site Generator (SSG)].

```shell
pnpm qwik add # or `yarn qwik add`
```

## Setting up the database

Add `.env` file at the root of the project and add the following variable inside it.

```
VITE_DB_URL=
VITE_BASE_URL=
```

Assing the database url of your Turso database and the base URL of your app on these two environmental variables when developing locally.

[Qwik Docs]: https://qwik.builder.io/
[Turso]: https://chiselstrike.com
[QwikCity]: https://qwik.builder.io/qwikcity/overview/
[routing docs]: https://qwik.builder.io/qwikcity/routing/overview/
[Vite public directory]: https://vitejs.dev/guide/assets.html#the-public-directory
[Static Site Generator (SSG)]: https://qwik.builder.io/qwikcity/guides/static-site-generation/
