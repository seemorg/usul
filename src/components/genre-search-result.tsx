import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import type { searchGenres } from "@/server/typesense/genre";
import { getTranslations } from "next-intl/server";

export default async function GenreSearchResult({
  result,
}: {
  result: NonNullable<
    Awaited<ReturnType<typeof searchGenres>>["results"]["hits"]
  >[number];
}) {
  const t = await getTranslations("entities");

  const genre = result.document;

  return (
    <Link
      href={navigation.genres.bySlug(genre.slug)}
      prefetch={false}
      className="w-full border-b border-border bg-transparent px-6 py-8 transition-colors hover:bg-secondary"
    >
      <div className="flex items-center justify-between">
        <div className="max-w-[70%] flex-1">
          <h2 className="text-xl text-foreground">{genre.name}</h2>
        </div>

        <div className="flex-1 text-end">
          {t("x-texts", { count: genre.booksCount })}
        </div>
      </div>
    </Link>
  );
}
