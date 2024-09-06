import { env } from "@/env";
import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
// import EventSource from "eventsource";

const baseRequest = async (
  method: "GET" | "POST",
  relativeUrl: string,
  body?: object,
) => {
  return (
    await fetch(`${env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL}${relativeUrl}`, {
      cache: "no-store",
      method,
      ...(method === "POST" && body
        ? {
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        : {}),
    })
  ).json();
};

export const chatWithBook = async (body: {
  bookSlug: string;
  question: string;
  messages: any[];
}) => {
  const response = (await baseRequest("POST", `/chat/${body.bookSlug}`, {
    question: body.question,
    messages: body.messages,
  })) as { chatId: string };

  // this has the first chunk, we need to get the rest via SSE
  const eventSource = new EventSource(
    `${env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL}/chat/sse/${response.chatId}`,
  );

  return eventSource;
};

export const searchBook = async (bookSlug: string, query: string) => {
  const results = (await baseRequest(
    "GET",
    `/search?q=${query}&bookSlug=${bookSlug}`,
  )) as SemanticSearchBookNode[];

  return results.map(parseSourceNode);
};

export const parseSourceNode = (sourceNode: SemanticSearchBookNode) => {
  const chapters = sourceNode.metadata.chapters;
  const pages = sourceNode.metadata.pages;

  return {
    ...sourceNode,
    metadata: {
      bookSlug: sourceNode.metadata.bookSlug,
      chapters,
      pages,
    },
  };
};