import { localeRouterProps } from "@/lib/locale/utils";
import { booksSorts } from "@/lib/urls";
import { viewSchema } from "@/validation/view";
import { type DynamicRoute } from "next-typesafe-url";
import { z } from "zod";

const sorts = booksSorts.map((s) => s.value);
const defaultSort: (typeof sorts)[number] = "relevance";

export const Route = {
  routeParams: z.object({
    authorSlug: z.string().catch(""),
    ...localeRouterProps,
  }),
  searchParams: z.object({
    q: z.string().default(""),
    page: z.number().min(1).catch(1),
    view: viewSchema,
    sort: z
      .enum(sorts as any)
      .default(defaultSort)
      .catch(defaultSort)
      .transform((v) => {
        return v;
      }),
    genres: z
      .string()
      .transform((v) => v.split(","))
      .catch([] as string[]),
  }),
} satisfies DynamicRoute;

export type RouteType = typeof Route;
