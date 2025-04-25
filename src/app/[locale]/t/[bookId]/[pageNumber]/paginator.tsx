"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { useNavbarStore } from "@/stores/navbar";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useBookDetailsStore } from "../_stores/book-details";

export default function Paginator({
  totalPages,
  currentPage,
  slug,
}: {
  totalPages: number;
  currentPage: number;
  slug: string;
}) {
  const showNavbar = useNavbarStore((s) => s.showNavbar);
  const isDetailsOpen = useBookDetailsStore((s) => s.isOpen);
  const searchParams = useSearchParams();

  const makeUrl = (url: string) => {
    if (searchParams.size === 0) {
      return url;
    }

    return `${url}?${searchParams.toString()}`;
  };

  return (
    <div
      className={cn(
        "sticky top-[80vh] right-0 left-0 z-10 m-0 flex w-full items-center justify-center transition will-change-transform",
        // showNavbar ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
        isDetailsOpen || showNavbar ? "-translate-y-[10vh]" : "",
      )}
      dir="ltr"
    >
      <div className="bg-background flex items-center gap-2 rounded-full p-1">
        <Button
          size="icon"
          asChild={currentPage !== 1}
          disabled={currentPage === 1}
          className="size-8"
        >
          {currentPage === 1 ? (
            <ChevronLeftIcon className="h-4 w-4" />
          ) : (
            <Link
              href={makeUrl(navigation.books.pageReader(slug, currentPage - 1))}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Link>
          )}
        </Button>

        <span className="text-sm">{currentPage}</span>

        <Button
          size="icon"
          asChild={currentPage !== totalPages}
          disabled={currentPage === totalPages}
          className="size-8"
        >
          {currentPage === totalPages ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <Link
              href={makeUrl(navigation.books.pageReader(slug, currentPage + 1))}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          )}
        </Button>
      </div>
    </div>
  );
}
