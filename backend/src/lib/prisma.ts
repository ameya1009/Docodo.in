import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/docodo";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

declare global {
  var prismaBackend: PrismaClient | undefined;
}

export const prisma = global.prismaBackend || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.prismaBackend = prisma;
}
