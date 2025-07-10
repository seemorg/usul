import type { ApiAuthor } from "@/types/api/author";
import { cache } from "react";

import type { PathLocale } from "../locale/utils";
import { apiFetch } from "./utils";

export const getAuthorBySlug = cache(
  async (slug: string, params: { locale?: PathLocale } = {}) => {
    return await apiFetch<ApiAuthor>({
      path: `/author/${slug}`,
      params,
    });
  },
);
