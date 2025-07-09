import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useChatFilters } from "@/stores/chat-filters";
import { ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { AuthorsFilterContent } from "./authors-filter";
import { GenresFilterContent } from "./genres-filter";
import { TextsFilterContent } from "./texts-filter";

export default function HomepageFilters({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [filter, setFilter] = useState<"texts" | "authors" | "genres" | null>(
    null,
  );
  const clear = useChatFilters((s) => s.clear);
  const t = useTranslations();

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
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-semibold">
                {t("chat.input.filters")}
              </h4>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:bg-accent! text-sm"
                onClick={clear}
              >
                {t("common.clear-filters")}
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className="hover:bg-accent! w-full justify-between"
                onClick={() => setFilter("texts")}
              >
                {t("entities.texts")}
                <ChevronRightIcon className="size-4 rtl:rotate-180" />
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-accent! w-full justify-between"
                onClick={() => setFilter("authors")}
              >
                {t("entities.authors")}
                <ChevronRightIcon className="size-4 rtl:rotate-180" />
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-accent! w-full justify-between"
                onClick={() => setFilter("genres")}
              >
                {t("entities.genres")}
                <ChevronRightIcon className="size-4 rtl:rotate-180" />
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
