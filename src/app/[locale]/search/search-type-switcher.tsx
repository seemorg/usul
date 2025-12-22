"use client";

import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { navigation } from "@/lib/urls";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";

import type { SearchType } from "./routeType";
import { searchTypes } from "./routeType";

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
  const params = useSearchParams();
  const t = useTranslations();
  const router = useRouter();
  const _type = params.get("type");
  const type = searchTypes.includes(_type as SearchType) ? _type : "all";

  const handleTypeChange = (newType: string) => {
    startTransition(() => {
      router.push(
        navigation.search({
          type: newType as SearchType,
          query: params.get("q") || "",
        }),
      );
    });
  };

  return (
    <div className="border-border mt-5 w-full overflow-x-auto border-b">
      <Tabs value={type as string} onValueChange={handleTypeChange}>
        <TabsList className="h-10 border-none bg-transparent! shadow-none">
          <Trigger value="all" active={type === "all"} disabled={isPending}>
            {t("entities.all")}
          </Trigger>

          <Trigger
            value="content"
            active={type === "content"}
            disabled={isPending}
          >
            {t("entities.content")}
          </Trigger>
          <Trigger value="texts" active={type === "texts"} disabled={isPending}>
            {t("entities.texts")}
          </Trigger>
          <Trigger
            value="authors"
            active={type === "authors"}
            disabled={isPending}
          >
            {t("entities.authors")}
          </Trigger>
          <Trigger
            value="genres"
            active={type === "genres"}
            disabled={isPending}
          >
            {t("entities.genres")}
          </Trigger>
          <Trigger
            value="regions"
            active={type === "regions"}
            disabled={isPending}
          >
            {t("entities.regions")}
          </Trigger>
          <Trigger
            value="empires"
            active={type === "empires"}
            disabled={isPending}
          >
            {t("entities.empires")}
          </Trigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
