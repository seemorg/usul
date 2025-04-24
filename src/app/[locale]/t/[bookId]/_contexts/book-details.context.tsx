"use client";

import type { ApiBookResponse } from "@/types/api/book";
import { createContext, use, useEffect } from "react";
import { useChatStore } from "../_stores/chat";

interface BookDetailsContextValue {
  bookResponse: ApiBookResponse;
}

const BookDetailsContext = createContext<BookDetailsContextValue | null>(null);

export function BookDetailsProvider({
  children,
  bookResponse,
}: {
  children: React.ReactNode;
  bookResponse: ApiBookResponse;
}) {
  const initializeChat = useChatStore((s) => s.initializeChat);

  useEffect(() => {
    initializeChat({
      bookId: bookResponse.book.id,
      versionId: bookResponse.content.id,
    });
  }, [bookResponse, initializeChat]);

  return (
    <BookDetailsContext.Provider value={{ bookResponse }}>
      {children}
    </BookDetailsContext.Provider>
  );
}

export function useBookDetails() {
  const context = use(BookDetailsContext);
  if (!context) {
    throw new Error("useBookDetails must be used within a BookDetailsProvider");
  }
  return context;
}
