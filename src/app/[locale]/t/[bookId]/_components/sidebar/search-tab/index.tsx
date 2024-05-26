"use client";

import type { ReaderSearchParams } from "@/types/reader-search-params";
import SidebarContainer from "../sidebar-container";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/solid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@/navigation";
import Paginator from "@/components/ui/pagination";

interface SearchTabProps {
  bookId: string;
  searchParams: ReaderSearchParams;
}

const modes = [
  {
    name: "Keyword",
    description: "Keyword search",
  },
  {
    name: "AI",
    description: "AI search",
  },
];

const SearchResult = () => {
  return (
    <div className="border-b border-gray-500 pb-5 pt-10">
      <p dir="rtl" className="font-amiri text-lg">
        هَلْ تَسْتَطِيعُ أَنْ تُرِيَنِي كَيْفَ كَانَ رَسُولُ اللَّهِ ﷺ
        يَتَوَضَّأُ، قَالَ عَبْدُ اللَّهِ بْنُ زَيْدٍ: نَعَمْ، فَدَعَا
        بِوَضُوءٍ، فَأَفْرَغَ عَلَى يَدَيْهِ فَغَسَلَ يَدَيْهِ مَرَّتَيْنِ،
        ثُمَّ مَضْمَضَ، ثُمَّ غَسَلَ وَجْهَهُ ثَلاثًا، ثُمَّ غَسَلَ يَدَيْهِ
        إِلَى الْمِرْفَقَيْنِ مَرَّتَيْنِ، ثُمَّ مَسَحَ مِنْ مُقَدَّمِ...
      </p>

      <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
        <p>Page 24</p>
        <p>باب: غسل اليدين في الوضوء</p>
      </div>
    </div>
  );
};

export default function SearchTab({ bookId, searchParams }: SearchTabProps) {
  const [activeMode, setActiveMode] = useState(modes[0]?.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // listen for keyboard shortcuts
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "f") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <SidebarContainer>
        <div className="mx-auto flex max-w-[13rem] items-center rounded-full bg-border">
          {modes.map((mode) => (
            <Tooltip key={mode.name}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveMode(mode.name)}
                  className={cn(
                    "flex-1 rounded-full px-2 py-2 text-xs font-medium",
                    mode.name === activeMode
                      ? "bg-primary text-white"
                      : "text-gray-500",
                  )}
                >
                  {mode.name}

                  {/* <InformationCircleIcon className="h-4 w-4" /> */}
                </button>
              </TooltipTrigger>

              <TooltipContent side="bottom">
                <p>{mode.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 flex-shrink-0"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
          </Button>

          <Input
            type="text"
            ref={inputRef}
            placeholder="Enter your search query (⌘ + F)"
            className="h-10 w-full border border-gray-300 bg-white shadow-none dark:border-border dark:bg-transparent"
          />
        </div>
      </SidebarContainer>

      <Separator className="my-8" />

      <SidebarContainer>
        <div className="flex items-center justify-between">
          <Select>
            <SelectTrigger
              className="h-10 w-10 max-w-full justify-center bg-white p-0 sm:w-[140px] sm:justify-between sm:px-3 sm:py-2"
              showIconOnMobile={false}
              // isLoading={isPending}
            >
              <div className="hidden sm:block">
                {/* {currentSortLabel ? (
            t(currentSortLabel)
          ) : ( */}
                <SelectValue placeholder={"Sort by"} />
                {/* )} */}
              </div>

              <ArrowsUpDownIcon className="h-4 w-4 sm:hidden" />
            </SelectTrigger>

            <SelectContent>
              {/* {sorts.map((sort) => (
          <SelectItem key={sort.value} value={sort.value}>
            {t(sort.label)}
          </SelectItem>
        ))} */}
              <SelectItem value="match">Best Match</SelectItem>
              <SelectItem value={"order"}>Order</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="link" className="p-0" asChild>
            <Link href="/search">View in Advanced Search</Link>
          </Button>
        </div>

        <p className="mt-5">22 Result</p>

        <div className="flex flex-col">
          <SearchResult />
          <SearchResult />
          <SearchResult />
          <SearchResult />
          <SearchResult />
          <SearchResult />
        </div>

        <div className="mt-14">
          <Paginator totalPages={5} currentPage={2} />
        </div>
      </SidebarContainer>

      <div className="h-16" />
    </>
  );
}
