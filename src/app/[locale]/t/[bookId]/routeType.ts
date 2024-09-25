import { type DynamicRoute } from "next-typesafe-url";
import { z } from "zod";

export const Route = {
  routeParams: z.object({
    bookId: z.string().catch(""),
    versionId: z.string().optional().catch(""),
    view: z
      .enum(["pdf", "default"])
      .optional()
      .default("default")
      .catch("default"),
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
