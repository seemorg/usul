"use client";

import type { Sort } from "@/types/sort";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { parseAsStringEnum, useQueryState } from "nuqs";

import { usePage } from "./paginator";

export const useSort = <T extends string>(sorts: T[]) => {
  return useQueryState(
    "sort",
    parseAsStringEnum<T>(sorts).withDefault(sorts[0]!).withOptions({
      clearOnDefault: true,
    }),
  );
};

export default function SearchSort({
  sorts,
  isLoading,
}: {
  sorts: Sort[];
  isLoading?: boolean;
}) {
  const t = useTranslations("common");
  const [sort, setSort] = useSort(sorts.map((s) => s.value));
  const [, setPage] = usePage();

  function handleSortChange(newValue: string) {
    void setSort(newValue);
    void setPage(1);
  }

  const currentSortLabel = sorts.find((s) => s.value === sort)?.label;

  return (
    <Select value={sort} onValueChange={handleSortChange} disabled={isLoading}>
      <SelectTrigger
        className="h-10 w-10 max-w-full justify-center p-0 sm:w-fit sm:justify-between sm:px-3 sm:py-2"
        showIconOnMobile={false}
        isLoading={isLoading}
      >
        <div className="hidden sm:block sm:ltr:mr-2 sm:rtl:ml-2">
          {currentSortLabel ? (
            t(currentSortLabel)
          ) : (
            <SelectValue placeholder={t("sorts.placeholder")} />
          )}
        </div>

        <ArrowsUpDownIcon className="size-4 sm:hidden" />
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
