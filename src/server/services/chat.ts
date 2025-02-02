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
  versionId: string;
  question: string;
  messages: any[];
}) => {
  const response = await baseRequest<{ chatId: string }>(
    "POST",
    `/chat/${body.bookId}/${body.versionId}`,
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

export type SearchBookResponse = {
  total: number;
  totalPages: number;
  perPage: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  results: SemanticSearchBookNode[];
};

export const searchBook = async (
  bookId: string,
  versionId: string,
  query: string,
  type: "semantic" | "keyword" = "semantic",
  page: number = 1,
) => {
  const queryParams = new URLSearchParams();
  queryParams.set("q", query);
  queryParams.set("bookId", bookId);
  queryParams.set("versionId", versionId);
  queryParams.set("type", type);
  queryParams.set("page", page.toString());

  const results = await baseRequest<SearchBookResponse>(
    "GET",
    `/search?${queryParams.toString()}`,
  );

  return results;
};
