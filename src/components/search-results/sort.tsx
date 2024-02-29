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
      <SelectTrigger className="h-10 w-[140px] max-w-full">
        {isPending && <Spinner className="h-4 w-4" />}
        {currentSort ? (
          sorts.find((s) => s.value === currentSort)?.label
        ) : (
          <SelectValue placeholder="Sort By" />
        )}
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
