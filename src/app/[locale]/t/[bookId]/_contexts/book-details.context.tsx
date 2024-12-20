"use client";

import type { ApiBookResponse } from "@/types/api/book";
import { createContext, useContext } from "react";

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
  return (
    <BookDetailsContext.Provider value={{ bookResponse }}>
      {children}
    </BookDetailsContext.Provider>
  );
}

export function useBookDetails() {
  const context = useContext(BookDetailsContext);
  if (!context) {
    throw new Error("useBookDetails must be used within a BookDetailsProvider");
  }
  return context;
}
