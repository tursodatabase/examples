// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "A simple Nuxt app listing popular web development frameworks",
      "meta": [
        {
          "name": "viewport",
          "content": "width=device-width, initial-scale=1"
        },
        {
          "charset": "utf-8"
        },
        {
          "name": "description",
          "content": "A simple Nuxt app that lists items from a Turso database"
        }
      ],
    }
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    tursoDbUrl: '',
    tursoDbAuthToken: ''
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
