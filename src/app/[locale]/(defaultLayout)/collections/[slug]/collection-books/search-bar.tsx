"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { parseAsString, useQueryState } from "nuqs";

const DEBOUNCE_DELAY = 1500;

export const useSearch = () => {
  return useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({
      clearOnDefault: true,
    }),
  );
};

export default function SearchBar({
  disabled,
  isLoading,
  placeholder,
}: {
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  const [search, setSearch] = useSearch();
  const [value, setValue] = useState(search);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  function handleSearch(term: string) {
    setValue(term);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newTimeout = setTimeout(() => {
      void setSearch(term);
    }, DEBOUNCE_DELAY);

    timeoutRef.current = newTimeout;
  }

  const Icon = isLoading ? Spinner : MagnifyingGlassIcon;

  return (
    <div className="text-foreground relative w-full">
      <Icon className="absolute top-1/2 size-3 -translate-y-1/2 ltr:left-3 rtl:right-3" />

      <Input
        type="text"
        placeholder={placeholder}
        className="h-10 w-full pl-8 rtl:pr-8"
        autoComplete="off"
        disabled={disabled}
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
