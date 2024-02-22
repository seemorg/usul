import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    // @ts-expect-error we're not using a db for now
    uri: env.DATABASE_URL,
  },
} satisfies Config;
