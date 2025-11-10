import { cache } from "react";
import { unstable_cache } from "next/cache";

import { apiFetch } from "./utils";

export const getTotalEntities = cache(async () => {
  return unstable_cache(
    async () => {
      const defaultResponse = {
        books: 0,
        authors: 0,
        regions: 0,
        advancedGenres: 0,
        genres: 0,
      };

      return (
        (await apiFetch<typeof defaultResponse>(`/total`)) || defaultResponse
      );
    },
    ["total"],
    {
      revalidate: false, // make this static
      tags: ["total"],
    },
  )();
});
