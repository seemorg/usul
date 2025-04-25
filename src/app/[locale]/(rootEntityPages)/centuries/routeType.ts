import type { Sort } from "@/types/sort";
import type {DynamicRoute} from "next-typesafe-url";
import { z } from "zod";

export const sorts = [
  {
    label: "sorts.chronological",
    value: "chronological",
  },
  {
    label: "sorts.no-of-texts",
    value: "texts",
  },
] as const satisfies Sort[];

const sortsValues = sorts.map((s) => s.value);
const defaultSort: (typeof sortsValues)[number] = "chronological";

export const Route = {
  searchParams: z.object({
    q: z.string().or(z.number()).default("").catch(""),
    page: z.number().min(1).catch(1),
    sort: z
      .enum(sortsValues as any)
      .default(defaultSort)
      .catch(defaultSort)
      .transform((v: (typeof sortsValues)[number]) => {
        let typesenseValue: string = v;
        if (v === "chronological") typesenseValue = "chronological:asc";
        if (v === "texts") typesenseValue = "booksCount:desc";

        return {
          typesenseValue,
          raw: v,
        };
      }),
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
