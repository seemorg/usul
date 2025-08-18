"use client";

import { useCallback, useTransition } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseAsStringEnum, useQueryState } from "nuqs";

import type { SearchType } from "./routeType";

const Trigger = ({
  active,
  ...props
}: React.ComponentProps<typeof TabsTrigger> & { active?: boolean }) => {
  return (
    <div className="relative h-full">
      <TabsTrigger
        className="rounded-none data-[state=active]:shadow-none"
        {...props}
      />
      {active && (
        <div className="bg-foreground absolute right-0 -bottom-1 left-0 h-0.5" />
      )}
    </div>
  );
};

export default function SearchTypeSwitcher() {
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useQueryState(
    "type",
    parseAsStringEnum([
      "all",
      "content",
      "texts",
      "authors",
      "genres",
      "regions",
    ])
      .withDefault("all")
      .withOptions({ clearOnDefault: true, shallow: false, startTransition }),
  );

  const handleTypeChange = useCallback((newType: string) => {
    setType(newType as SearchType);
  }, []);

  return (
    <div className="border-border mt-5 w-full border-b">
      <Tabs value={type} onValueChange={handleTypeChange}>
        <TabsList className="h-10 border-none bg-transparent! shadow-none">
          <Trigger value="all" active={type === "all"} disabled={isPending}>
            All
          </Trigger>
          <Trigger
            value="content"
            active={type === "content"}
            disabled={isPending}
          >
            Content
          </Trigger>
          <Trigger value="texts" active={type === "texts"} disabled={isPending}>
            Texts
          </Trigger>
          <Trigger
            value="authors"
            active={type === "authors"}
            disabled={isPending}
          >
            Authors
          </Trigger>
          <Trigger
            value="genres"
            active={type === "genres"}
            disabled={isPending}
          >
            Genres
          </Trigger>
          <Trigger
            value="regions"
            active={type === "regions"}
            disabled={isPending}
          >
            Regions
          </Trigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
