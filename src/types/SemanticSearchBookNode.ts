export interface SemanticSearchBookNode {
  metadata: {
    chapters: string[];
    pages: {
      volume: string;
      page: number;
    }[];
  };
  text: string;
  highlights?: string[];
  score?: number;
}
