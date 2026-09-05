import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { db } from "./supabase-db";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function isDbConnectionError(err: any): boolean {
  if (!err) return false;
  const msg = typeof err === "string" ? err : err.message || err.stack || "";
  const code = err.code || "";
  return (
    msg.includes("P1001") ||
    msg.includes("Can't reach database server") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("connection closed") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("Connection terminated") ||
    msg.includes("timeout") ||
    code === "ECONNREFUSED" ||
    code === "P1001"
  );
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
    connectionTimeoutMillis: 3000,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: ["error"],
  });
}

const rawPrisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = rawPrisma;
}

export const prisma: PrismaClient = new Proxy(rawPrisma, {
  get(target: any, prop: string | symbol) {
    if (prop === "$transaction") {
      return async (arg: any) => {
        try {
          return await target.$transaction(arg);
        } catch (err: any) {
          if (isDbConnectionError(err)) {
            console.warn("[Prisma Resilient Proxy] Database socket unreachable. Executing transaction via Supabase REST API.");
            if (typeof arg === "function") {
              return await arg(prisma);
            }
            if (Array.isArray(arg)) {
              return await Promise.all(arg);
            }
          }
          throw err;
        }
      };
    }

    const modelName = typeof prop === "string" ? prop : String(prop);
    const modelTarget = target[prop];

    if (typeof modelName === "string" && !modelName.startsWith("$") && !modelName.startsWith("_")) {
      const fallbackModel = (db as any)[modelName];
      return new Proxy(modelTarget || {}, {
        get(mTarget: any, mProp: string | symbol) {
          const methodName = typeof mProp === "string" ? mProp : String(mProp);
          return async (...args: any[]) => {
            try {
              if (typeof mTarget[mProp] === "function") {
                return await mTarget[mProp](...args);
              }
            } catch (err: any) {
              if (isDbConnectionError(err)) {
                console.warn(`[Prisma Resilient Proxy] Prisma ${modelName}.${methodName} connection failed. Falling back to Supabase REST.`);
                if (fallbackModel && typeof fallbackModel[methodName] === "function") {
                  return await fallbackModel[methodName](...args);
                }
                if (methodName.startsWith("findMany")) return [];
                if (methodName.startsWith("count")) return 0;
                if (methodName.startsWith("find")) return null;
                return null;
              }
              throw err;
            }

            if (fallbackModel && typeof fallbackModel[methodName] === "function") {
              return await fallbackModel[methodName](...args);
            }
            if (methodName.startsWith("findMany")) return [];
            if (methodName.startsWith("count")) return 0;
            return null;
          };
        },
      });
    }

    return modelTarget;
  },
}) as PrismaClient;
