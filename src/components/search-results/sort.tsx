"use client";

import type { Sort } from "@/types/sort";
import { useState, useTransition } from "react";
import { usePathname, useRouter } from "@/navigation";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function SearchSort({
  sorts,
  currentSort,
}: {
  sorts: Sort[];
  currentSort: string;
}) {
  const t = useTranslations("common");
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(currentSort);

  function handleSortChange(newValue: string) {
    setValue(newValue);

    const params = new URLSearchParams(window.location.search);

    params.set("sort", newValue);

    // make sure to reset pagination state
    if (params.has("page")) {
      params.delete("page");
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  const currentSortLabel = sorts.find((s) => s.value === currentSort)?.label;

  return (
    <Select value={value} onValueChange={handleSortChange} disabled={isPending}>
      <SelectTrigger
        className="h-10 w-10 max-w-full justify-center p-0 sm:w-[140px] sm:justify-between sm:px-3 sm:py-2"
        showIconOnMobile={false}
        isLoading={isPending}
      >
        <div className="hidden sm:block">
          {currentSortLabel ? (
            t(currentSortLabel)
          ) : (
            <SelectValue placeholder={t("sorts.placeholder")} />
          )}
        </div>

        <ArrowsUpDownIcon className="h-4 w-4 sm:hidden" />
      </SelectTrigger>

      <SelectContent>
        {sorts.map((sort) => (
          <SelectItem key={sort.value} value={sort.value}>
            {t(sort.label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
