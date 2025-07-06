export interface SemanticSearchBookNode {
  metadata: {
    chapters: number[];
    pages: {
      index: number;
      volume: string;
      page: number;
    }[];
  };
  text: string;
  highlights?: string[];
  score?: number;
}
