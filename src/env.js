import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    TYPESENSE_URL: z.string().url().min(1),
    TYPESENSE_API_KEY: z.string().min(1),
    DATABASE_URL: z.string().url().min(1),
    RESEND_AUDIENCE_ID: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
  },
  client: {},
  shared: {
    NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT: z.string().url().min(1),
    NEXT_PUBLIC_SEMANTIC_SEARCH_URL: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    TYPESENSE_URL: process.env.TYPESENSE_URL,
    TYPESENSE_API_KEY: process.env.TYPESENSE_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT:
      process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT,
    NEXT_PUBLIC_SEMANTIC_SEARCH_URL:
      process.env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
