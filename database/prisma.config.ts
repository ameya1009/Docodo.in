import { defineConfig } from "prisma/config";

const dbUrl = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/docodo";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: dbUrl,
  },
});
