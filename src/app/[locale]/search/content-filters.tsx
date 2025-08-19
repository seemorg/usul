"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";

import type { GroupCondition } from "../t/[bookId]/_components/search-tab/search-filters";
import {
  AzureSearchFilter,
  buildQuery,
  parseQuery,
} from "../t/[bookId]/_components/search-tab/search-filters";

export default function ContentFilters() {
  const t = useTranslations();
  const [pending, startTransition] = useTransition();

  // URL state for compiled query
  const [compiledQuery, setCompiledQuery] = useQueryState(
    "compiledQuery",
    parseAsString.withDefault("").withOptions({
      clearOnDefault: true,
      startTransition,
      shallow: false,
    }),
  );

  // Initialize advanced query from URL or default
  const parsedQuery = useMemo((): GroupCondition => {
    if (compiledQuery) {
      try {
        return parseQuery(compiledQuery);
      } catch {
        // If parsing fails, return default
        return {
          type: "group",
          conditions: [
            {
              operator: "like",
              value: "",
              not: false,
            },
          ],
          combineWith: "AND",
        };
      }
    }

    return {
      type: "group",
      conditions: [
        {
          operator: "like",
          value: "",
          not: false,
        },
      ],
      combineWith: "AND",
    };
  }, [compiledQuery]);

  // Local state for current editing (not yet applied)
  const [localAdvancedQuery, setLocalAdvancedQuery] =
    useState<GroupCondition>(parsedQuery);
  const cachedLocal = useMemo(
    () => buildQuery(localAdvancedQuery, true),
    [localAdvancedQuery],
  );

  // Sync URL changes to both local and applied state (when user navigates back/forward)
  useEffect(() => {
    setLocalAdvancedQuery(parsedQuery);
  }, [parsedQuery]);

  // Handle apply button click
  const handleApply = () => {
    setCompiledQuery(cachedLocal);
  };

  const hasPendingChanges = cachedLocal !== compiledQuery;

  return (
    <div className="relative p-4 sm:p-0">
      <p className="mb-8 font-medium">{t("common.advanced-matching")}</p>
      <AzureSearchFilter
        value={localAdvancedQuery}
        setValue={setLocalAdvancedQuery}
      />

      <Button
        onClick={handleApply}
        className="mt-6 rounded-3xl"
        isLoading={pending}
        disabled={!hasPendingChanges}
      >
        {t("common.apply")}
      </Button>
    </div>
  );
}
