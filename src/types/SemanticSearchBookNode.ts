export interface SemanticSearchBookNode {
  metadata: {
    chapters: number[];
    pages: {
      volume: string;
      page: number;
    }[];
  };
  text: string;
  highlights?: string[];
  score?: number;
}
