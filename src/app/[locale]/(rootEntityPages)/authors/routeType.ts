import { gregorianYearToHijriYear } from "@/lib/date";
import { yearsSorts } from "@/lib/urls";
import { type DynamicRoute } from "next-typesafe-url";
import { z } from "zod";

export const sorts = [
  ...yearsSorts,
  {
    label: "No. of Texts",
    value: "texts",
  },
] as const;

const sortsValues = sorts.map((s) => s.value);
const defaultSort: (typeof sortsValues)[number] = "texts";

const defaultYear = [1, gregorianYearToHijriYear(new Date().getFullYear())] as [
  number,
  number,
];

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
    year: z
      .string()
      .transform((v) => {
        const [from, to] = v.split("-");
        if (from === undefined || to === undefined) return defaultYear;

        const fromNum = parseInt(from);
        const toNum = parseInt(to);

        if (isNaN(fromNum) || isNaN(toNum)) return defaultYear;

        if (fromNum > toNum) return defaultYear;

        if (fromNum < 1 || toNum < 1) return defaultYear;

        return [fromNum, toNum] as [number, number];
      })
      .catch(defaultYear),
    regions: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
