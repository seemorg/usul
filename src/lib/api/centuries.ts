import type { Century } from "@/types/api/century";
import { cache } from "react";
import { apiFetch } from "@/lib/api/utils";

export const findAllCenturies = cache(async () => {
  const result = await apiFetch<Century[]>("/century");
  return result ?? [];
});

export const findCenturyBySlug = cache(async (slug: string | number) => {
  const result = await apiFetch<Century>(`/century/${slug}`);
  return result;
});
