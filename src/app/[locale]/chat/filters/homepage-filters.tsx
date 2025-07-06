import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";

import { AuthorsFilterContent } from "./authors-filter";
import { GenresFilterContent } from "./genres-filter";
import { TextsFilterContent } from "./texts-filter";

// import { useTranslations } from "next-intl";

export default function HomepageFilters({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [filter, setFilter] = useState<"texts" | "authors" | "genres" | null>(
    null,
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>

      <PopoverContent
        className={cn(
          "flex max-h-96 flex-col gap-4 overflow-y-auto",
          filter ? "w-100" : "w-62",
        )}
      >
        {filter === null && (
          <>
            <h4 className="text-xl font-semibold">Filters</h4>

            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className="hover:bg-accent! w-full justify-between"
                onClick={() => setFilter("texts")}
              >
                Texts
                <ChevronRightIcon className="size-4" />
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-accent! w-full justify-between"
                onClick={() => setFilter("authors")}
              >
                Authors
                <ChevronRightIcon className="size-4" />
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-accent! w-full justify-between"
                onClick={() => setFilter("genres")}
              >
                Genres
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </>
        )}

        {filter === "texts" && (
          <TextsFilterContent onBack={() => setFilter(null)} />
        )}
        {filter === "authors" && (
          <AuthorsFilterContent onBack={() => setFilter(null)} />
        )}
        {filter === "genres" && (
          <GenresFilterContent onBack={() => setFilter(null)} />
        )}
      </PopoverContent>
    </Popover>
  );
}
