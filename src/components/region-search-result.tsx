import { navigation } from "@/lib/urls";
import type { searchRegions } from "@/server/typesense/region";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import EntityCard from "./entity-card";
import { useTranslations } from "next-intl";
import { usePathLocale } from "@/lib/locale/utils";

export default function RegionSearchResult({
  result,
  prefetch = true,
}: {
  result: Awaited<ReturnType<typeof searchRegions>>["results"]["hits"][number];
  prefetch?: boolean;
}) {
  const t = useTranslations();
  const pathLocale = usePathLocale();

  const region = result.document;

  const primaryName = getPrimaryLocalizedText(region.names, pathLocale);
  const secondaryName = getSecondaryLocalizedText(region.names, pathLocale);

  const totalBooks = region.booksCount;
  const subLocations = region.subLocations;

  return (
    <EntityCard
      href={navigation.regions.bySlug(region.slug)}
      prefetch={prefetch}
      primaryTitle={primaryName!}
      secondaryTitle={secondaryName}
      primarySubtitle={`${t("common.includes")} ${t("entities.x-locations", { count: subLocations.length })}`}
      tags={[t("entities.x-texts", { count: totalBooks })]}
    />
  );
}
