import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/docodo";
  
  const isCloudPostgres =
    dbUrl.includes("supabase.co") ||
    dbUrl.includes("neon.tech") ||
    dbUrl.includes("railway.app") ||
    dbUrl.includes("render.com") ||
    dbUrl.includes("sslmode=require");

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: isCloudPostgres ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

export const prisma: PrismaClient =
  globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
