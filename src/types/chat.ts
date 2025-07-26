import type { SemanticSearchBookNode } from "./SemanticSearchBookNode";

export type MessageAnnotation =
  | {
      type: "SOURCES";
      value: (SemanticSearchBookNode & {
        book: { slug: string; primaryName: string };
      })[];
    }
  | {
      type: "STATUS";
      value: "generating-queries" | "generating-response";
    }
  | {
      type: "STATUS";
      value: "searching";
      queries: string[];
    }
  | {
      type: "CHAT_ID";
      value: string;
    };
