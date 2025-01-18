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
    // RESEND_DONORS_AUDIENCE_ID: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    STRIPE_API_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    UPSTASH_REDIS_REST_URL: z.string().url().min(1),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  },
  client: {},
  shared: {
    NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT: z.string().url().min(1),
    NEXT_PUBLIC_PDF_EXPRESS_LICENSE_KEY: z.string().min(1),
    NEXT_PUBLIC_SEMANTIC_SEARCH_URL: z.string().min(1),
    NEXT_PUBLIC_CLARITY_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_ENABLE_CLARITY: z.string().optional().default("false"),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: z.string().min(1),
    VERCEL_ENV: z
      .enum(["development", "preview", "production"])
      .default("development"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    TYPESENSE_URL: process.env.TYPESENSE_URL,
    TYPESENSE_API_KEY: process.env.TYPESENSE_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
    // RESEND_DONORS_AUDIENCE_ID: process.env.RESEND_DONORS_AUDIENCE_ID,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT:
      process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT,
    NEXT_PUBLIC_PDF_EXPRESS_LICENSE_KEY:
      process.env.NEXT_PUBLIC_PDF_EXPRESS_LICENSE_KEY,
    NEXT_PUBLIC_SEMANTIC_SEARCH_URL:
      process.env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL,
    NEXT_PUBLIC_CLARITY_PROJECT_ID: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
    NEXT_PUBLIC_ENABLE_CLARITY: process.env.NEXT_PUBLIC_ENABLE_CLARITY,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID:
      process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID:
      process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
    VERCEL_ENV: process.env.VERCEL_ENV,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
