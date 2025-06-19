import type { Pagination } from "@/types/pagination";

export interface SearchOptions {
  limit?: number;
  page?: number;
  sortBy?: string;
  filters?: Record<string, string | number | string[] | number[] | null>;
}

export interface SearchResponse<T> {
  pagination: Pagination;
  results: {
    found: number;
    page: number;
    hits: T[];
  };
}
