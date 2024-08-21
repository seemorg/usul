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
  let chapters: string[] = [];
  const pages: { vol: string; page: number }[] = [];

  try {
    chapters = JSON.parse(sourceNode.metadata.chapters as any) as string[];
  } catch (e) {}

  try {
    pages.push(
      ...JSON.parse(sourceNode.metadata.pages as any).map((p: string) => {
        const [vol, page] = p.slice(1).split(":p");
        const parsedPage = page ? parseInt(page) : -1;
        return { vol, page: isNaN(parsedPage) ? -1 : parsedPage };
      }),
    );
  } catch (e) {}

  return {
    ...sourceNode,
    metadata: {
      ...sourceNode.metadata,
      chapters,
      pages,
    },
  };
};
