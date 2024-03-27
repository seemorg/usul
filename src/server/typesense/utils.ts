import type { Pagination } from "@/types/pagination";

export const makePagination = (
  totalRecords: number,
  currentPage: number,
  perPage: number,
): Pagination => {
  const totalPages = Math.ceil(totalRecords / perPage);

  return {
    totalRecords,
    totalPages,
    currentPage,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
};

export interface SearchOptions {
  limit?: number;
  page?: number;
  sortBy?: string;
  filters?: Record<string, string | number | string[] | number[] | null>;
}

export const prepareQuery = (q: string) => {
  const final = [q];

  const queryWithoutAl = q.replace(/(al-)/gi, "");
  if (queryWithoutAl !== q) final.push(queryWithoutAl);

  return final.join(" || ");
};

export const weightsMapToQueryBy = (weightsMap: Record<number, string[]>) =>
  Object.values(weightsMap).flat().join(", ");

export const weightsMapToQueryWeights = (
  weightsMap: Record<number, string[]>,
) =>
  Object.keys(weightsMap)
    // @ts-expect-error - TS doesn't like the fact that we're using Object.keys
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    .map((weight) => new Array(weightsMap[weight]!.length).fill(weight))
    .flat()
    .join(", ");
