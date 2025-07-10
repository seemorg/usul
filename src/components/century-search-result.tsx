import type { Century } from "@/types/api/century";
import { navigation } from "@/lib/urls";
import { useFormatter, useTranslations } from "next-intl";

import EntityCard from "./entity-card";

export default function CenturySearchResult({
  result,
  prefetch = true,
}: {
  result: Century;
  prefetch?: boolean;
}) {
  const t = useTranslations();
  const formatter = useFormatter();

  return (
    <EntityCard
      href={navigation.centuries.byNumber(result.centuryNumber)}
      prefetch={prefetch}
      primaryTitle={t("entities.ordinal-century", {
        count: result.centuryNumber,
      })}
      primarySubtitle={`${formatter.number(result.yearFrom, { useGrouping: false })} - ${formatter.number(result.yearTo, { useGrouping: false })} ${t("common.year-format.ah.title")}`}
      tags={[t("entities.x-texts", { count: result.totalBooks })]}
    />
  );
}
