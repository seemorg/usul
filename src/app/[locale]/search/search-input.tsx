"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { navigation } from "@/lib/urls";
import { useRouter } from "@/navigation";
import { SearchType } from "@/types/search";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SearchInput() {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");

  // Sync input value with URL changes (for back/forward navigation)
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setInputValue(urlQuery);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      router.push(
        navigation.search({
          query: inputValue,
          searchType:
            (searchParams.get("searchType") as "keyword" | "semantic") ||
            "keyword",
          type: (searchParams.get("type") as SearchType) || "all",
        }),
      );
    });
  };

  return (
    <form className="relative w-full" onSubmit={handleSubmit}>
      <Input
        className="h-12 w-full rounded-3xl border-[0.5px] px-5 font-semibold shadow-none"
        placeholder={t("common.search") + "..."}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        autoFocus
      />

      <div className="absolute top-1/2 -translate-y-1/2 ltr:right-0 ltr:-translate-x-2 rtl:left-0 rtl:translate-x-2">
        <button
          className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full disabled:opacity-50"
          type="submit"
          disabled={isPending}
        >
          <SearchIcon className="size-5" />
        </button>
      </div>
    </form>
  );
}
