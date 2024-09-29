"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import type { SearchType } from "./routeType";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "@/navigation";

export default function SearchTypeSwitcher() {
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") as SearchType) ?? "all";

  const router = useRouter();
  const pathname = usePathname();

  const [currentType, setCurrentType] = useState(type);

  const handleTypeChange = useCallback(
    (newType: string) => {
      setCurrentType(newType as SearchType);

      const params = new URLSearchParams(searchParams);

      if (newType === "all") {
        params.delete("type");
      } else {
        params.set("type", newType);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="mt-10">
      <Tabs value={currentType} onValueChange={handleTypeChange}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="texts">Texts</TabsTrigger>
          <TabsTrigger value="authors">Authors</TabsTrigger>
          <TabsTrigger value="genres">Genres</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
