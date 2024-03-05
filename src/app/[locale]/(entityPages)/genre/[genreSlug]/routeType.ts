import { gregorianYearToHijriYear } from "@/lib/date";
import { booksSorts } from "@/lib/urls";
import { type DynamicRoute } from "next-typesafe-url";
import { z } from "zod";

const sorts = booksSorts.map((s) => s.value);
const defaultSort: (typeof sorts)[number] = "relevance";

const defaultYear = [1, gregorianYearToHijriYear(new Date().getFullYear())] as [
  number,
  number,
];

export const Route = {
  routeParams: z.object({
    genreSlug: z.string().catch(""),
  }),
  searchParams: z.object({
    q: z.string().default(""),
    page: z.number().min(1).catch(1),
    sort: z
      .enum(sorts as any)
      .default(defaultSort)
      .catch(defaultSort)
      .transform((v) => {
        return v;
      }),
    authors: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
    regions: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
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
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
