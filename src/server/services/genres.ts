import type { PathLocale } from "@/lib/locale/utils";
import type { ApiGenre } from "@/types/api/genre";
import { cache } from "react";
import { apiFetch } from "@/lib/api/utils";

export const findAllGenresWithBooksCount = cache(
  async ({
    yearRange,
    authorId,
    bookIds,
    regionId,
    locale,
  }: {
    yearRange?: [number, number];
    bookIds?: string[];
    authorId?: string;
    regionId?: string;
    locale?: PathLocale;
  } = {}) => {
    const result = await apiFetch<ApiGenre[]>({
      path: "/genre",
      params: {
        yearRange,
        authorId,
        bookIds,
        regionId,
        locale,
      },
    });

    return result ?? [];
  },
);
