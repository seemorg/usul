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
