import type { Sort } from "@/types/sort";
import type { DynamicRoute } from "next-typesafe-url";
import { yearsSorts } from "@/lib/urls";
import { yearRangeSchema } from "@/validation/year-range";
import { z } from "zod";

export const sorts = [
  ...yearsSorts,
  {
    label: "sorts.no-of-texts",
    value: "texts",
  },
] as const satisfies Sort[];

const sortsValues = sorts.map((s) => s.value);
const defaultSort: (typeof sortsValues)[number] = "texts";

export const Route = {
  searchParams: z.object({
    q: z.string().default(""),
    page: z.number().min(1).catch(1),
    sort: z
      .enum(sortsValues as any)
      .default(defaultSort)
      .catch(defaultSort)
      .transform((v: (typeof sortsValues)[number]) => {
        let typesenseValue: string = v;
        if (v === "year-asc") typesenseValue = "year:asc";
        if (v === "year-desc") typesenseValue = "year:desc";
        if (v === "texts") typesenseValue = "booksCount:desc";

        return {
          typesenseValue,
          raw: v,
        };
      }),
    year: yearRangeSchema,
    regions: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
