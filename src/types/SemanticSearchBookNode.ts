export interface SemanticSearchBookNode {
  metadata: {
    bookSlug: string;
    chapters: string[];
    pages: {
      vol: string;
      page: number;
    }[];
  };
  text: string;
  score?: number;
}
