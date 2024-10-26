import type { SemanticSearchBookNode } from "./SemanticSearchBookNode";

export type ChatResponse =
  | {
      response: string;
      // metadata: Record<string, unknown>;
    }
  | {
      type: "SOURCES";
      sourceNodes: SemanticSearchBookNode[];
    };
