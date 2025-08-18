"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { navigation } from "@/lib/urls";
import { useRouter } from "@/navigation";
import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SearchInput({
  initialValue,
}: {
  initialValue?: string;
}) {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState<string>(initialValue ?? "");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      router.push(navigation.search.index({ type: "all", query }), undefined, {
        showProgressBar: true,
      });
    });
  };

  return (
    <form className="relative w-full" onSubmit={handleSubmit}>
      <Input
        className="h-12 w-full rounded-3xl border-[0.5px] px-5 font-semibold shadow-none"
        placeholder={t("common.search") + "..."}
        value={query}
        autoFocus
        onChange={(e) => setQuery(e.target.value)}
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
