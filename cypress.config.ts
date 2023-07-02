import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.LOCAL_SITE_URL,
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
});
