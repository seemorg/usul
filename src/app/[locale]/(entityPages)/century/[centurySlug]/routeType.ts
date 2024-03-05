import { yearsSorts } from "@/lib/urls";
import { type DynamicRoute } from "next-typesafe-url";
import { z } from "zod";

const sorts = yearsSorts.map((s) => s.value);
const defaultSort: (typeof sorts)[number] = "relevance";

export const Route = {
  routeParams: z.object({
    centurySlug: z.number().catch(0),
  }),
  searchParams: z.object({
    q: z.string().default(""),
    page: z.number().min(1).catch(1),
    sort: z
      .enum(sorts as any)
      .default(defaultSort)
      .catch(defaultSort)
      .transform((v: (typeof sorts)[number]) => {
        let typesenseValue: string = v;

        if (v === "year-asc") typesenseValue = "year:asc";
        if (v === "year-desc") typesenseValue = "year:desc";

        return {
          typesenseValue,
          raw: v,
        };
      }),
    authors: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
    genres: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
    regions: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
