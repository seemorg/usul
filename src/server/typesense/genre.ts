import { makeSearchRequest } from "@/lib/typesense";
import { makePagination, type SearchOptions } from "./utils";
import type { SearchResponse } from "typesense/lib/Typesense/Documents";
import type { GenreDocument } from "@/types/genre";

const INDEX = "genres";
const DEFAULT_PER_PAGE = 5;

const queryWeights = {
  1: ["name"],
};

const queryBy = Object.values(queryWeights).flat().join(", ");
const queryByWeights = Object.keys(queryWeights)
  // @ts-expect-error - TS doesn't like the fact that we're using Object.keys
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  .map((weight) => new Array(queryWeights[weight]!.length).fill(weight))
  .flat()
  .join(", ");

export const searchGenres = async (q: string, options?: SearchOptions) => {
  const { limit = DEFAULT_PER_PAGE, page = 1 } = options ?? {};

  const filters: string[] = [];

  const results = (await makeSearchRequest(INDEX, {
    q,
    query_by: queryBy,
    query_by_weights: queryByWeights,
    prioritize_token_position: true,
    limit,
    page,
    ...(options?.sortBy &&
      options.sortBy !== "relevance" && { sort_by: options.sortBy }),
    ...(filters.length > 0 && { filter_by: filters.join(" && ") }),
  })) as SearchResponse<GenreDocument>;

  return {
    results,
    pagination: makePagination(results.found, results.page, limit),
  };
};
