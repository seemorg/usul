"use client";

import { useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Spinner from "@/components/ui/spinner";
import { usePathname, useRouter } from "@/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import { Input } from "../ui/input";

const DEBOUNCE_DELAY = 1500;

export default function SearchBar({
  disabled,
  defaultValue,
  placeholder,
}: {
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const [value, setValue] = useState(defaultValue);

  const getQueryUrlParams = (query: string) => {
    const newParams = new URLSearchParams();

    if (query) {
      newParams.set("q", query);
    } else {
      newParams.delete("q");
    }

    if (params.has("view")) {
      newParams.set("view", params.get("view")!);
    }

    if (params.has("type")) {
      newParams.set("type", params.get("type")!);
    }

    return newParams;
  };

  function handleSearch(term: string) {
    setValue(term);
    const newParams = getQueryUrlParams(term);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newTimeout = setTimeout(() => {
      startTransition(() => {
        replace(`${pathname}?${newParams.toString()}`, { scroll: false });
      });
    }, DEBOUNCE_DELAY);

    timeoutRef.current = newTimeout;
  }

  return (
    <div className="text-foreground relative w-full">
      <MagnifyingGlassIcon className="absolute top-1/2 h-3 w-3 -translate-y-1/2 ltr:left-3 rtl:right-3" />

      <Input
        type="text"
        placeholder={placeholder}
        className="h-10 w-full pl-8 rtl:pr-8"
        autoComplete="off"
        disabled={disabled}
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {isPending && (
        <div className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3">
          <Spinner className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}
