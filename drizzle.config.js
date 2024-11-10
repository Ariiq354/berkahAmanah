/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./server/database/schema/*",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
    authToken: process.env.DATABASE_AUTH_TOKEN ?? "",
  },
  casing: "snake_case",
};
