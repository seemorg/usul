import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import type { searchGenres } from "@/server/typesense/genre";
import { getTranslations } from "next-intl/server";
import { getPathLocale } from "@/lib/locale/server";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import DottedList from "./ui/dotted-list";

export default async function GenreSearchResult({
  result,
  prefetch = true,
}: {
  result: NonNullable<
    Awaited<ReturnType<typeof searchGenres>>["results"]["hits"]
  >[number];
  prefetch?: boolean;
}) {
  const t = await getTranslations("entities");
  const locale = await getPathLocale();

  const genre = result.document;

  const name = getPrimaryLocalizedText(genre.nameTranslations, locale);
  const secondaryName = getSecondaryLocalizedText(
    genre.nameTranslations,
    locale,
  );

  return (
    <Link
      href={navigation.genres.bySlug(genre.slug)}
      prefetch={prefetch}
      className="flex w-full items-center justify-between gap-4 border-b border-border bg-transparent px-2 py-6 transition-colors hover:bg-secondary dark:hover:bg-secondary/20 sm:px-6"
    >
      <div className="flex-1 text-xl">
        <h2 className="text-lg font-semibold">{name}</h2>

        <DottedList
          className="mt-2 text-xs text-muted-foreground"
          items={[
            locale === "en" && genre.transliteration && (
              <p>{genre.transliteration}</p>
            ),
            secondaryName && (
              <p dangerouslySetInnerHTML={{ __html: secondaryName }} />
            ),
          ]}
        />
      </div>

      <p> {t("x-texts", { count: genre.booksCount })}</p>
    </Link>
  );
}
