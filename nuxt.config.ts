export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: false },
  modules: [
    "@nuxt/ui",
    "nuxt-security",
    "@nuxt/fonts",
    "@nuxt/eslint",
    "@nuxt/image",
    "@vueuse/nuxt",
  ],
  css: ["~/assets/main.css"],

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseAuthToken: process.env.DATABASE_AUTH_TOKEN,
  },

  $production: {
    ignorePrefix: "_",
  },
});