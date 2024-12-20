import { env } from "@/env";
import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";

const baseRequest = async <T>(
  method: "GET" | "POST",
  relativeUrl: string,
  body?: object,
) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL}${relativeUrl}`,
    {
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
    },
  );

  if (!response.ok || response.status >= 300) {
    throw new Error(response.statusText);
  }

  return response.json() as Promise<T>;
};

export const chatWithBook = async (body: {
  bookId: string;
  question: string;
  messages: any[];
}) => {
  const response = await baseRequest<{ chatId: string }>(
    "POST",
    `/chat/${body.bookId}`,
    {
      question: body.question,
      messages: body.messages,
    },
  );

  // this has the first chunk, we need to get the rest via SSE
  const eventSource = new EventSource(
    `${env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL}/chat/sse/${response.chatId}`,
  );

  return { eventSource, messageId: response.chatId };
};

export const sendFeedback = async (body: {
  messageId: string;
  feedback: "positive" | "negative";
}) => {
  const response = await baseRequest<{ success: boolean }>(
    "POST",
    `/chat/feedback/${body.messageId}`,
    {
      type: body.feedback,
    },
  );

  return response;
};

export const searchBook = async (
  bookId: string,
  query: string,
  type: "semantic" | "keyword" = "semantic",
) => {
  const results = (await baseRequest(
    "GET",
    `/search?q=${query}&bookId=${bookId}&type=${type}`,
  )) as SemanticSearchBookNode[];

  return results.map(parseSourceNode);
};

export const parseSourceNode = (sourceNode: SemanticSearchBookNode) => {
  const chapters = sourceNode.metadata.chapters;
  const pages = sourceNode.metadata.pages;

  return {
    ...sourceNode,
    metadata: {
      chapters,
      pages,
    },
  };
};
