export interface SemanticSearchBookNode {
  metadata: {
    bookSlug: string;
    chapters: string[];
    pages: {
      vol: string;
      page: number;
    }[]; // ["v1:p1"]
  };
  text: string;
  score?: number;
}
