import type { ApiEmpire } from "@/types/api/empire";
import type { HierarchicalItem } from "@/components/hierarchical-list-view";
import { cache } from "react";

import type { PathLocale } from "../locale/utils";
import { apiFetch } from "./utils";

export const findEmpireBySlug = cache(
  async (slug: string, locale: PathLocale = "en") => {
    const result = await apiFetch<ApiEmpire>({
      path: `/empire/${slug}`,
      params: {
        locale,
      },
    });
    return result ?? null;
  },
);

export const findAllEmpiresWithBooksCount = cache(
  async (
    params?: {
      yearRange?: [number, number];
      genreId?: string;
    },
    locale: PathLocale = "en",
  ) => {
    const result = await apiFetch<ApiEmpire[]>({
      path: "/empire",
      params: {
        locale,
        ...params,
      },
    });

    return result ?? [];
  },
);

export const getEmpireHierarchy = cache(
  async (locale: PathLocale = "en") => {
    const result = await apiFetch<
      (HierarchicalItem & { numberOfAuthors: number; numberOfBooks: number })[]
    >({
      path: "/empire/hierarchy",
      params: { locale },
    });

    return result ?? [];
  },
);

