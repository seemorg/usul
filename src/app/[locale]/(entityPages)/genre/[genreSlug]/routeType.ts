import type { DynamicRoute } from "next-typesafe-url";
import { alphabeticalSorts, yearsSorts } from "@/lib/urls";
import { viewSchema } from "@/validation/view";
import { yearRangeSchema } from "@/validation/year-range";
import { z } from "zod";

const sorts = [...yearsSorts, ...alphabeticalSorts].map((s) => s.value);
const defaultSort: (typeof sorts)[number] = "relevance";

export const Route = {
  routeParams: z.object({
    genreSlug: z.string().catch(""),
  }),
  searchParams: z.object({
    q: z.string().default(""),
    page: z.number().min(1).catch(1),
    view: viewSchema,
    sort: z
      .enum(sorts as any)
      .default(defaultSort)
      .catch(defaultSort),
    authors: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
    regions: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
    year: yearRangeSchema,
    fromHomepage: z.boolean().default(false).catch(false),
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
