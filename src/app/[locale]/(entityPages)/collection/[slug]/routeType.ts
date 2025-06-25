import type { DynamicRoute } from "next-typesafe-url";
import { yearsSorts } from "@/lib/urls";
import { viewSchema } from "@/validation/view";
import { z } from "zod";

const sorts = yearsSorts.map((s) => s.value);
const defaultSort: (typeof sorts)[number] = "relevance";

export const Route = {
  routeParams: z.object({
    slug: z.string().catch(""),
  }),
  searchParams: z.object({
    q: z.string().default(""),
    page: z.number().min(1).catch(1),
    view: viewSchema,
    sort: z
      .enum(sorts as any)
      .default(defaultSort)
      .catch(defaultSort),
    genres: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
