import { SemanticSearchBookNode } from "./SemanticSearchBookNode";

export type SearchType =
  | "all"
  | "content"
  | "texts"
  | "authors"
  | "genres"
  | "regions"
  | "empires";

export type BookContentSearchResult = {
  node: SemanticSearchBookNode;
  versionId: string;
  book: {
    id: string;
    slug: string;
    primaryName: string;
    secondaryName?: string;
    transliteration?: string;
    author: {
      id: string;
      slug: string;
      primaryName: string;
      secondaryName?: string;
      transliteration?: string;
      year?: number;
    };
  };
};

export type SearchContentResponse = {
  total: number;
  totalPages: number;
  perPage: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  results: BookContentSearchResult[];
};
