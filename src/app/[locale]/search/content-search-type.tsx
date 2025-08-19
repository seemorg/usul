"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { parseAsStringEnum, useQueryState } from "nuqs";

export default function ContentSearchType() {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [searchType, setSearchType] = useQueryState(
    "searchType",
    parseAsStringEnum(["keyword", "semantic"])
      .withDefault("keyword")
      .withOptions({ shallow: false, clearOnDefault: true, startTransition }),
  );

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => setSearchType("keyword")}
        disabled={isPending}
        className={cn(
          "rounded-3xl border-[1.5px]",
          searchType === "keyword"
            ? "border-foreground! text-foreground"
            : "border-border text-muted-foreground",
        )}
      >
        Keyword
      </Button>
      <Button
        variant="outline"
        onClick={() => setSearchType("semantic")}
        disabled={isPending}
        className={cn(
          "rounded-3xl border-[1.5px]",
          searchType === "semantic"
            ? "border-foreground! text-foreground"
            : "border-border text-muted-foreground",
        )}
      >
        Semantic
      </Button>
    </div>
  );
}
