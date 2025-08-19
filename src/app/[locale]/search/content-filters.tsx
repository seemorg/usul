"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { AzureSearchFilter } from "../t/[bookId]/_components/search-tab/search-filters";

export default function ContentFilters() {
  const t = useTranslations();
  const [advancedQuery, setAdvancedQuery] = useState<any>({
    type: "group",
    conditions: [
      {
        operator: "like",
        value: "",
        not: false,
      },
    ],
    combineWith: "AND",
  });

  return (
    <div className="relative">
      <p className="mb-8 font-medium">{t("common.advanced-matching")}</p>
      <AzureSearchFilter value={advancedQuery} setValue={setAdvancedQuery} />
    </div>
  );
}
