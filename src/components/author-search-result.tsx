import type { searchAuthors } from "@/server/typesense/author";
import { navigation } from "@/lib/urls";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import { usePathLocale } from "@/lib/locale/utils";
import { useTranslations } from "next-intl";
import EntityCard from "./entity-card";
import { formatDeathYear } from "@/lib/date";

export default function AuthorSearchResult({
  result,
  prefetch = true,
}: {
  result: Awaited<ReturnType<typeof searchAuthors>>["results"]["hits"][number];
  prefetch?: boolean;
}) {
  const t = useTranslations();
  const pathLocale = usePathLocale();

  const { document } = result;

  const transliteration =
    document.transliteration && pathLocale === "en"
      ? document.transliteration
      : undefined;
  const primaryName =
    transliteration ??
    getPrimaryLocalizedText(document.primaryNames, pathLocale);

  const secondaryName = getSecondaryLocalizedText(
    document.primaryNames,
    pathLocale,
  );

  const primaryOtherNames = getPrimaryLocalizedText(
    document.otherNames,
    pathLocale,
  );

  const secondaryOtherNames = getSecondaryLocalizedText(
    document.otherNames,
    pathLocale,
  );

  return (
    <EntityCard
      href={navigation.authors.bySlug(document.slug)}
      prefetch={prefetch}
      primaryTitle={primaryName!}
      secondaryTitle={secondaryName}
      primarySubtitle={
        primaryOtherNames && primaryOtherNames.length > 0
          ? `${formatDeathYear(document.year, pathLocale)} - ${primaryOtherNames[0]}`
          : undefined
      }
      secondarySubtitle={
        secondaryOtherNames && secondaryOtherNames.length > 0
          ? `${formatDeathYear(document.year, "ar")} - ${secondaryOtherNames[0]}`
          : undefined
      }
      tags={[t("entities.x-texts", { count: document.booksCount })]}
    />
  );
}
