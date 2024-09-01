import { type DynamicRoute } from "next-typesafe-url";
import { z } from "zod";

export const Route = {
  routeParams: z.object({
    bookId: z.string().catch(""),
    versionId: z.string().optional().catch(""),
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
