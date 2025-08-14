import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { apiFetch } from "@/lib/api/utils";
import { PathLocale } from "@/lib/locale/utils";

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

export const translateChunk = async (body: {
  text: string;
  locale: PathLocale;
}) => {
  const response = await apiFetch<{ text: string }>(
    { path: `/chat/translate`, params: { locale: body.locale } },
    {
      method: "POST",
      body: {
        text: body.text,
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
  const results = await apiFetch<SearchBookResponse>({
    path: `/search/content`,
    params: { q: query, bookId, versionId, type, page },
  });

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
  const results = await apiFetch<SearchCorpusResponse>({
    path: `/v1/${type === "semantic" ? "vector-search" : "keyword-search"}`,
    params: { q: query, page, include_details: true, type },
  });

  return results;
};
