export type SearchType =
  | "all"
  | "content"
  | "texts"
  | "authors"
  | "genres"
  | "regions";

export type SearchContentResponse = {
  total: number;
  totalPages: number;
  perPage: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  results: {
    score: number;
    node: {
      id: string;
      metadata: {
        bookId: string;
        pages: {
          index: number;
          volume: string;
          page: number;
        }[];
        versionId: string;
      };
    } & ({ text: string } | { highlights: string[] });
    book: {
      slug: string;
      primaryName: string;
      secondaryName?: string;
      transliteration?: string;
      author: {
        slug: string;
        primaryName: string;
        secondaryName?: string;
        transliteration?: string;
        year?: number;
      };
    };
  }[];
};
