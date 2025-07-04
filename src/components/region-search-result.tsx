import type { RegionDocument } from "@/types/region";
import { navigation } from "@/lib/urls";
import { useTranslations } from "next-intl";

import EntityCard from "./entity-card";

export default function RegionSearchResult({
  result,
  prefetch = true,
}: {
  result: RegionDocument;
  prefetch?: boolean;
}) {
  const t = useTranslations();

  const primaryName = result.primaryName;
  const secondaryName = result.secondaryName;

  const totalBooks = result.booksCount;
  const subLocations = result.subLocations ?? [];

  return (
    <EntityCard
      href={navigation.regions.bySlug(result.slug)}
      prefetch={prefetch}
      primaryTitle={primaryName}
      secondaryTitle={secondaryName}
      primarySubtitle={`${t("common.includes")} ${t("entities.x-locations", { count: subLocations.length })}`}
      tags={[t("entities.x-texts", { count: totalBooks })]}
    />
  );
}
