"use client";

import { usePathname, useRouter } from "@/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState, useTransition } from "react";
import Spinner from "../ui/spinner";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";

export default function SearchSort({
  sorts,
  currentSort,
}: {
  sorts: {
    label: string;
    value: string;
  }[];
  currentSort: string;
}) {
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

  return (
    <Select value={value} onValueChange={handleSortChange} disabled={isPending}>
      <SelectTrigger
        className="h-10 w-10 max-w-full justify-center p-0 sm:w-[140px] sm:justify-between sm:px-3 sm:py-2"
        showIconOnMobile={false}
        isLoading={isPending}
      >
        <div className="hidden sm:block">
          {currentSort ? (
            sorts.find((s) => s.value === currentSort)?.label
          ) : (
            <SelectValue placeholder="Sort By" />
          )}
        </div>

        <ArrowsUpDownIcon className="h-4 w-4 sm:hidden" />
      </SelectTrigger>

      <SelectContent>
        {sorts.map((sort) => (
          <SelectItem key={sort.value} value={sort.value}>
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
