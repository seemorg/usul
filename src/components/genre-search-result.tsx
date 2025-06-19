import type { searchGenres } from "@/server/typesense/genre";
import { usePathLocale } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { useTranslations } from "next-intl";

import EntityCard from "./entity-card";

export default function GenreSearchResult({
  result,
  prefetch = true,
}: {
  result: NonNullable<
    Awaited<ReturnType<typeof searchGenres>>["results"]["hits"]
  >[number];
  prefetch?: boolean;
}) {
  const t = useTranslations("entities");
  const locale = usePathLocale();

  const transliteration =
    result.transliteration && locale === "en"
      ? result.transliteration
      : undefined;

  return (
    <EntityCard
      href={navigation.genres.bySlug(result.slug)}
      prefetch={prefetch}
      primaryTitle={result.primaryName}
      secondaryTitle={result.secondaryName}
      primarySubtitle={transliteration}
      tags={[t("x-texts", { count: result.booksCount })]}
    />
  );
}
