import type { DynamicRoute } from "next-typesafe-url";
import { alphabeticalSorts, yearsSorts } from "@/lib/urls";
import { viewSchema } from "@/validation/view";
import { yearRangeSchema } from "@/validation/year-range";
import { z } from "zod";

const sorts = [...yearsSorts, ...alphabeticalSorts].map((s) => s.value);
const defaultSort: (typeof sorts)[number] = "relevance";

export const Route = {
  searchParams: z.object({
    q: z.string().default(""),
    page: z.number().min(1).catch(1),
    view: viewSchema,
    year: yearRangeSchema,
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
