import type { Sort } from "@/types/sort";
import type { DynamicRoute } from "next-typesafe-url";
import { yearsSorts } from "@/lib/urls";
import { yearRangeSchema } from "@/validation/year-range";
import { z } from "zod";

export const sorts = [
  ...yearsSorts,
  {
    label: "sorts.no-of-texts-asc",
    value: "texts-asc",
  },
  {
    label: "sorts.no-of-texts-desc",
    value: "texts-desc",
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
      .catch(defaultSort),
    year: yearRangeSchema,
    regions: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
