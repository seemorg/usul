import { env } from "@/env";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { any } from "zod";

const prismaClientSingleton = () => {
  if (
    env.NODE_ENV === "development" &&
    env.DATABASE_URL.includes("localhost")
  ) {
    // we're not using neon
    return new PrismaClient();
  } else {
    const pool = new Pool({ connectionString: env.DATABASE_URL });
    const adapter = new PrismaNeon(pool);

    return new PrismaClient({ datasources: { db: { url: env.DATABASE_URL } } });
  }
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
