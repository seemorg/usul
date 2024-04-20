import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";
import { env } from "@/env";

export let db: PrismaClient;

if (env.NODE_ENV === "development" && env.DATABASE_URL.includes("localhost")) {
  // we're not using neon
  db = new PrismaClient();
} else {
  neonConfig.webSocketConstructor = ws;

  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);

  db = new PrismaClient({ adapter });
}
