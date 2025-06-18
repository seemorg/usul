import type { Sort } from "@/types/sort";
import type { DynamicRoute } from "next-typesafe-url";
import { z } from "zod";

export const sorts = [
  {
    label: "sorts.no-of-texts-desc",
    value: "texts-desc",
  },
  {
    label: "sorts.no-of-texts-asc",
    value: "texts-asc",
  },
  {
    label: "sorts.no-of-authors-desc",
    value: "authors-desc",
  },
  {
    label: "sorts.no-of-authors-asc",
    value: "authors-asc",
  },
] as const satisfies Sort[];

const sortsValues = sorts.map((s) => s.value);
const defaultSort: (typeof sortsValues)[number] = "texts-desc";

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
        if (v === "texts-desc") typesenseValue = "booksCount:desc";
        if (v === "texts-asc") typesenseValue = "booksCount:asc";
        if (v === "authors-desc") typesenseValue = "authorsCount:desc";
        if (v === "authors-asc") typesenseValue = "authorsCount:asc";

        return {
          typesenseValue,
          raw: v,
        };
      }),
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
