import { navigation } from "@/lib/urls";
import type { searchGenres } from "@/server/typesense/genre";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import EntityCard from "./entity-card";
import { useTranslations } from "next-intl";
import { usePathLocale } from "@/lib/locale/utils";

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

  const genre = result.document;

  const name = getPrimaryLocalizedText(genre.nameTranslations, locale);

  const transliteration =
    genre.transliteration && locale === "en"
      ? genre.transliteration
      : undefined;
  const secondaryName = getSecondaryLocalizedText(
    genre.nameTranslations,
    locale,
  );

  return (
    <EntityCard
      href={navigation.genres.bySlug(genre.slug)}
      prefetch={prefetch}
      primaryTitle={name!}
      secondaryTitle={secondaryName}
      primarySubtitle={transliteration}
      tags={[t("x-texts", { count: genre.booksCount })]}
    />
  );
}
