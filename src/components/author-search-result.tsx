import type { searchAuthors } from "@/server/typesense/author";
import { formatDeathYear } from "@/lib/date";
import { usePathLocale } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { useTranslations } from "next-intl";

import EntityCard from "./entity-card";

export default function AuthorSearchResult({
  result,
  prefetch = true,
}: {
  result: Awaited<ReturnType<typeof searchAuthors>>["results"]["hits"][number];
  prefetch?: boolean;
}) {
  const t = useTranslations();
  const pathLocale = usePathLocale();

  const transliteration =
    result.transliteration && pathLocale === "en"
      ? result.transliteration
      : undefined;
  const primaryName = transliteration ?? result.primaryName;
  const primaryOtherNames = result.otherNames;
  const secondaryOtherNames = result.secondaryOtherNames;

  return (
    <EntityCard
      href={navigation.authors.bySlug(result.slug)}
      prefetch={prefetch}
      primaryTitle={primaryName}
      secondaryTitle={result.secondaryName}
      primarySubtitle={
        primaryOtherNames && primaryOtherNames.length > 0
          ? `${formatDeathYear(result.year, pathLocale)} - ${primaryOtherNames[0]}`
          : undefined
      }
      secondarySubtitle={
        secondaryOtherNames && secondaryOtherNames.length > 0
          ? `${formatDeathYear(result.year, "ar")} - ${secondaryOtherNames[0]}`
          : undefined
      }
      tags={[t("entities.x-texts", { count: result.booksCount })]}
    />
  );
}
