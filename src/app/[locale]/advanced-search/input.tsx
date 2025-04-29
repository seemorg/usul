"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "@/navigation";
import { ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdvancedSearchInput() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const getQueryUrlParams = (query: string) => {
    const newParams = new URLSearchParams(params);

    if (query) {
      newParams.set("q", query);
    } else {
      newParams.delete("q");
    }

    newParams.delete("page");
    return newParams;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newParams = getQueryUrlParams(query);
    router.push(`${pathname}?${newParams.toString()}`, undefined, {
      showProgressBar: true,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex h-12 items-center gap-0.5">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("entities.search-within", {
            entity: t("entities.texts"),
          })}
          className="h-full px-5 text-lg ltr:rounded-r-none rtl:rounded-l-none"
        />

        <Button
          type="submit"
          className="h-full ltr:rounded-l-none rtl:rounded-r-none"
        >
          <ChevronRightIcon className="size-5" />
        </Button>
      </form>
    </div>
  );
}
