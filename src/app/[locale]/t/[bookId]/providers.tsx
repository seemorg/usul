"use client";

import { useParams } from "next/navigation";
import ReaderContextProviders from "./_components/context";
import { useChatStore } from "./_stores/chat";
import { useBookDetailsStore } from "./_stores/book-details";
import { useEffect } from "react";
import { useSearchStore } from "./_stores/search";

export default function Providers({ children }: { children: React.ReactNode }) {
  const bookSlug = useParams().bookId as string;

  const resetChat = useChatStore((s) => s.reset);
  const resetSearch = useSearchStore((s) => s.reset);
  const setBookDetails = useBookDetailsStore((s) => s.setIsOpen);

  useEffect(() => {
    resetChat();
    resetSearch();
    setBookDetails(false);
  }, [bookSlug]);

  return <ReaderContextProviders>{children}</ReaderContextProviders>;
}
