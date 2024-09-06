"use server";

import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import {
  type SearchOptions,
  makePagination,
  prepareQuery,
  prepareResults,
} from "./utils";
import type { AuthorDocument } from "@/types/author";
import { makeSearchRequest } from "@/lib/typesense";
import { AUTHORS_COLLECTION } from "./config";

export const searchAuthors = async (q: string, options?: SearchOptions) => {
  const { limit = AUTHORS_COLLECTION.DEFAULT_PER_PAGE, page = 1 } =
    options ?? {};

  const yearRange = (options?.filters?.yearRange ?? null) as number[] | null;
  // const geographies = (options?.filters?.geographies ?? null) as
  //   | string[]
  //   | null;
  const regions = (options?.filters?.regions ?? null) as string[] | null;
  const ids = (options?.filters?.ids ?? null) as string[] | null;

  const filters: string[] = [];
  if (yearRange) filters.push(`year:[${yearRange[0]}..${yearRange[1]}]`);

  // if (geographies && geographies.length > 0) {
  //   filters.push(
  //     `geographies:[${geographies.map((geo) => `\`${geo}\``).join(", ")}]`,
  //   );
  // }

  if (regions && regions.length > 0) {
    filters.push(
      `regions:[${regions.map((region) => `\`${region}\``).join(", ")}]`,
    );
  }

  if (ids && ids.length > 0) {
    filters.push(`id:[${ids.map((id) => `\`${id}\``).join(", ")}]`);
  }

  const results = (await makeSearchRequest(AUTHORS_COLLECTION.INDEX, {
    q: prepareQuery(q),
    query_by: AUTHORS_COLLECTION.queryBy,
    query_by_weights: AUTHORS_COLLECTION.queryByWeights,
    prioritize_token_position: true,
    limit,
    page,
    ...(options?.sortBy &&
      options.sortBy !== "relevance" && { sort_by: options.sortBy }),
    ...(filters.length > 0 && { filter_by: filters.join(" && ") }),
  })) as SearchResponse<AuthorDocument>;

  return {
    results: prepareResults(results),
    pagination: makePagination(results.found, results.page, limit),
  };
};
