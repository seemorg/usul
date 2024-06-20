export interface SemanticSearchBookNode {
  metadata: {
    bookSlug: string;
    chapters: string[];
    page: number;
    vol: string;
  };
  text: string;
  score?: number;
}
