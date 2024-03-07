/* eslint-disable react/jsx-key */
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import type { searchRegions } from "@/server/typesense/region";
import DottedList from "./ui/dotted-list";

export default function RegionSearchResult({
  result,
}: {
  result: NonNullable<
    Awaited<ReturnType<typeof searchRegions>>["results"]["hits"]
  >[number];
}) {
  const region = result.document;

  const primaryArabicName = region.arabicName;
  const primaryLatinName = region.name;

  const totalBooks = region.booksCount;
  const subLocations = region.subLocations;

  return (
    <Link
      href={navigation.regions.bySlug(region.slug)}
      prefetch={false}
      className="w-full border-b border-border bg-transparent px-6 py-6 transition-colors hover:bg-secondary"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {primaryArabicName && (
            <h2
              className="text-xl text-foreground"
              dangerouslySetInnerHTML={{
                __html: primaryArabicName,
              }}
            />
          )}

          <DottedList
            className="mt-3 text-muted-foreground"
            items={[
              primaryLatinName && (
                <h2
                  className={cn(primaryArabicName ? "text-lg" : "text-xl")}
                  dangerouslySetInnerHTML={{
                    __html: primaryLatinName,
                  }}
                />
              ),

              subLocations.length > 0 && (
                <p>Includes {subLocations.length} locations</p>
              ),
            ]}
          />
        </div>
        <p>{totalBooks} Texts</p>
      </div>
    </Link>
  );
}
