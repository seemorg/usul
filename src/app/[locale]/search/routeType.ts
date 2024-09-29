import { booksSorts } from "@/lib/urls";
import { viewSchema } from "@/validation/view";
import { yearRangeSchema } from "@/validation/year-range";
import { type DynamicRoute } from "next-typesafe-url";
import { z } from "zod";

const sorts = booksSorts.map((s) => s.value);
const defaultSort: (typeof sorts)[number] = "relevance";

const searchTypes = ["all", "texts", "authors", "genres", "regions"] as const;
export type SearchType = (typeof searchTypes)[number];

export const Route = {
  searchParams: z.object({
    q: z.string().default(""),
    page: z.number().min(1).catch(1),
    view: viewSchema,
    year: yearRangeSchema,
    type: z.enum(searchTypes).default("all").catch("all"),
    sort: z
      .enum(sorts as any)
      .default(defaultSort)
      .catch(defaultSort),
    regions: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
    authors: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
    genres: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
