export interface SemanticSearchBookNode {
  id?: string;
  text: string;
  metadata: {
    chapters: number[];
    pages: {
      index: number;
      volume: string;
      page: number;
    }[];
  };
  highlights?: string[];
  score?: number;
}
