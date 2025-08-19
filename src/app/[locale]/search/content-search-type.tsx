"use client";

import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";

export default function ContentSearchType() {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useSearchParams();
  const _searchType = params.get("searchType") || "keyword";
  const searchType = _searchType === "semantic" ? "semantic" : "keyword";

  const handleSearchTypeChange = (type: "keyword" | "semantic") => {
    if (type === searchType) return;

    startTransition(() => {
      router.push(
        navigation.search({
          searchType: type,
          type: "content",
          query: params.get("q") || "",
        }),
      );
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => handleSearchTypeChange("keyword")}
        disabled={isPending}
        className={cn(
          "rounded-3xl border-[1.5px]",
          searchType === "keyword"
            ? "border-foreground! text-foreground"
            : "border-border text-muted-foreground",
        )}
      >
        {t("common.keyword")}
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSearchTypeChange("semantic")}
        disabled={isPending}
        className={cn(
          "rounded-3xl border-[1.5px]",
          searchType === "semantic"
            ? "border-foreground! text-foreground"
            : "border-border text-muted-foreground",
        )}
      >
        {t("common.semantic")}
      </Button>
    </div>
  );
}
