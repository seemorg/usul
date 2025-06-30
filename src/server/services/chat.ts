import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { env } from "@/env";
import { apiFetch } from "@/lib/api/utils";

const baseRequest = async <T>(
  method: "GET" | "POST",
  relativeUrl: string,
  body?: object,
  headers?: Record<string, string>,
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
              ...(headers ?? {}),
            },
          }
        : {
            headers,
          }),
    },
  );

  if (!response.ok || response.status >= 300) {
    throw new Error(response.statusText);
  }

  return response.json() as Promise<T>;
};

export const sendFeedback = async (body: {
  messageId: string;
  feedback: "positive" | "negative";
}) => {
  const response = await apiFetch<{ success: boolean }>(
    `/chat/feedback/${body.messageId}`,
    {
      method: "POST",
      body: {
        type: body.feedback,
      },
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

export type SearchCorpusResponse = {
  total: number;
  totalPages: number;
  perPage: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  results: {
    score: number;
    node: {
      id: string;
      metadata: {
        bookId: string;
        pages: {
          index: number;
          volume: string;
          page: number;
        }[];
        versionId: string;
      };
      book: {
        slug: string;
        primaryName: string;
        secondaryName?: string;
        transliteration?: string;
        author: {
          slug: string;
          primaryName: string;
          secondaryName?: string;
          transliteration?: string;
          year?: number;
        };
      };
    } & ({ text: string } | { highlights: string[] });
  }[];
};

export const searchCorpus = async (
  query: string,
  type: "semantic" | "keyword" = "semantic",
  page: number = 1,
) => {
  const queryParams = new URLSearchParams();
  queryParams.set("q", query);
  queryParams.set("page", page.toString());
  queryParams.set("include_details", "true");
  queryParams.set("type", type);

  const results = await baseRequest<SearchCorpusResponse>(
    "GET",
    `/v1/${type === "semantic" ? "vector-search" : "keyword-search"}?${queryParams.toString()}`,
    undefined,
    {
      Authorization: `Bearer ${env.SEMANTIC_SEARCH_API_KEY}`,
    },
  );

  return results;
};
