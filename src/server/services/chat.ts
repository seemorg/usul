import { env } from "@/env";
import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";

export const chatWithBook = async (body: {
  bookSlug: string;
  question: string;
  messages: any[];
}) => {
  const response = (await (
    await fetch(
      `${env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL}/chat/${body.bookSlug}`,
      {
        method: "POST",
        body: JSON.stringify({
          question: body.question,
          messages: body.messages,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  ).json()) as { chatId: string };

  // this has the first chunk, we need to get the rest via SSE
  const eventSource = new EventSource(
    `${env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL}/chat/sse/${response.chatId}`,
  );

  return eventSource;
};

export const searchBook = async (bookSlug: string, query: string) => {
  return (
    (await fetch(
      `${env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL}/search?q=${query}&bookSlug=${bookSlug}`,
    ).then((res) => res.json())) as SemanticSearchBookNode[]
  ).map((r) => ({
    ...r,
    metadata: {
      ...r.metadata,
      chapters: JSON.parse(r.metadata.chapters as any),
    },
  }));
};
