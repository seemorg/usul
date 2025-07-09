"use client";

import { useEffect, useMemo } from "react";
import { useBookDetails } from "@/app/[locale]/t/[bookId]/_contexts/book-details.context";
import { useChatStore } from "@/app/[locale]/t/[bookId]/_stores/chat";
import { env } from "@/env";
import { useChat } from "@ai-sdk/react";

export function useBookChat(bookId: string, versionId: string) {
  const { bookResponse } = useBookDetails();
  const syncHistory = useChatStore((s) => s.syncHistory);

  const aiVersion = useMemo(() => {
    const currentVersion = bookResponse.book.versions.find(
      (v) => v.id === versionId,
    );

    if (currentVersion?.aiSupported) return currentVersion.id;
    return bookResponse.book.aiVersion;
  }, [versionId, bookResponse]);

  const result = useChat({
    id: `book-chat-${bookId}-${versionId}`,
    api: `${env.NEXT_PUBLIC_API_BASE_URL}/chat/${bookId}/${aiVersion}`,
  });

  useEffect(() => {
    syncHistory(result.messages);
  }, [result.messages, syncHistory]);

  return result;
}
