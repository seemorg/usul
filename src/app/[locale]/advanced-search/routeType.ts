import type { DynamicRoute } from "next-typesafe-url";
import { booksSorts } from "@/lib/urls";
import { z } from "zod";

const sorts = booksSorts.map((s) => s.value);
const defaultSort: (typeof sorts)[number] = "relevance";

export const Route = {
  searchParams: z.object({
    q: z.string().default(""),
    page: z.number().min(1).catch(1),

    sort: z
      .enum(sorts as [string, ...string[]])
      .default(defaultSort)
      .catch(defaultSort)
      .transform((v) => {
        const typesenseValue: string = v;

        // if (v === "year-asc") typesenseValue = "year:asc";
        // if (v === "year-desc") typesenseValue = "year:desc";

        return {
          typesenseValue,
          raw: v,
        };
      }),
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
