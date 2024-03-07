import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import type { searchGenres } from "@/server/typesense/genre";

export default function GenreSearchResult({
  result,
}: {
  result: NonNullable<
    Awaited<ReturnType<typeof searchGenres>>["results"]["hits"]
  >[number];
}) {
  const genre = result.document;
  const primaryTitle = genre.name;
  const secondaryTitle = null;

  return (
    <Link
      href={navigation.genres.bySlug(genre.slug)}
      prefetch={false}
      className="w-full border-b border-border bg-transparent px-6 py-8 transition-colors hover:bg-secondary"
    >
      <div className="flex items-center justify-between">
        <div className="max-w-[70%] flex-1">
          {primaryTitle && (
            <h2 className="text-xl text-foreground">{primaryTitle}</h2>
          )}

          {secondaryTitle && (
            <h2
              className={cn(
                primaryTitle
                  ? "mt-3 text-lg text-muted-foreground"
                  : "text-xl text-foreground",
              )}
            >
              {secondaryTitle}
            </h2>
          )}
        </div>

        <div className="flex-1 text-end">{genre.booksCount} Texts</div>
      </div>
    </Link>
  );
}
