import type { DynamicRoute } from "next-typesafe-url";
import { z } from "zod";

export const Route = {
  searchParams: z.object({
    q: z.string().default(""),
    page: z.number().min(1).catch(1),
    type: z.enum(["semantic", "keyword"]).default("semantic"),
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
