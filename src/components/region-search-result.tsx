/* eslint-disable react/jsx-key */
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import type { searchRegions } from "@/server/typesense/region";
import DottedList from "./ui/dotted-list";
import { getTranslations } from "next-intl/server";
import { getPathLocale } from "@/lib/locale/server";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";

export default async function RegionSearchResult({
  result,
  prefetch = true,
}: {
  result: Awaited<ReturnType<typeof searchRegions>>["results"]["hits"][number];
  prefetch?: boolean;
}) {
  const t = await getTranslations();
  const pathLocale = await getPathLocale();

  const region = result.document;

  const primaryName = getPrimaryLocalizedText(region.names, pathLocale);
  const secondaryName = getSecondaryLocalizedText(region.names, pathLocale);

  const totalBooks = region.booksCount;
  const subLocations = region.subLocations;

  return (
    <Link
      href={navigation.regions.bySlug(region.slug)}
      prefetch={prefetch}
      className="w-full border-b border-border bg-transparent px-6 py-6 transition-colors hover:bg-secondary"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {primaryName && (
            <h2
              className="text-lg font-semibold"
              dangerouslySetInnerHTML={{
                __html: primaryName,
              }}
            />
          )}

          <DottedList
            className="mt-2 text-xs text-muted-foreground"
            items={[
              // primaryName && (
              //   <h2
              //     dangerouslySetInnerHTML={{
              //       __html: primaryName,
              //     }}
              //   />
              // ),
              secondaryName && (
                <h2
                  dangerouslySetInnerHTML={{
                    __html: secondaryName,
                  }}
                />
              ),
              subLocations.length > 0 && (
                <p>
                  {t("common.includes")}{" "}
                  {t("entities.x-locations", { count: subLocations.length })}
                </p>
              ),
            ]}
          />
        </div>

        <p>{t("entities.x-texts", { count: totalBooks })}</p>
      </div>
    </Link>
  );
}
