/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_HgsDbJu30Inr@ep-shy-boat-a4rs3sur-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require",
  },
};
