"use client";

import Spinner from "@/components/ui/spinner";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useRef, useState, useTransition } from "react";
import { Input } from "../ui/input";
import { usePathname, useRouter } from "@/navigation";

const DEBOUNCE_DELAY = 300;

const getQueryUrlParams = (query: string) => {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  } else {
    params.delete("q");
  }

  return params;
};

export default function SearchBar({
  disabled,
  defaultValue,
}: {
  disabled?: boolean;
  defaultValue?: string;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const [value, setValue] = useState(defaultValue);

  function handleSearch(term: string) {
    setValue(term);
    const params = getQueryUrlParams(term);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newTimeout = setTimeout(() => {
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, DEBOUNCE_DELAY);

    // @ts-ignore
    timeoutRef.current = newTimeout;
  }

  return (
    <div className="relative w-full text-black">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2" />

      <Input
        type="text"
        placeholder="Search within results..."
        className="h-10 w-full pl-8"
        autoComplete="off"
        disabled={disabled}
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {isPending && (
        <Spinner className="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2" />
      )}
    </div>
  );
}
