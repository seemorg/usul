import type { SemanticSearchBookNode } from "./SemanticSearchBookNode";

export type ChatResponse = {
  response: string;
  sourceNodes?: SemanticSearchBookNode[];
  metadata: Record<string, unknown>;
};
