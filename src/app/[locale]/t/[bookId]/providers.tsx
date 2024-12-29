"use client";

import ReaderContextProviders from "./_components/context";
import { useBookDetailsStore } from "./_stores/book-details";
import { useEffect } from "react";
import { useSearchStore } from "./_stores/search";

export default function Providers({ children }: { children: React.ReactNode }) {
  const resetSearch = useSearchStore((s) => s.reset);
  const setBookDetails = useBookDetailsStore((s) => s.setIsOpen);

  useEffect(() => {
    resetSearch();
    setBookDetails(false);
  }, []);

  return <ReaderContextProviders>{children}</ReaderContextProviders>;
}
