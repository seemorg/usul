/* eslint-disable react/jsx-key */
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useMemo, type ComponentProps, useState } from "react";
import type BookSearchResult from ".";

import { Link } from "@/navigation";
import { useQuery } from "@tanstack/react-query";
import { navigation } from "@/lib/urls";
import { findAuthorBySlug } from "@/server/services/authors";
import { Skeleton } from "../ui/skeleton";
import { useTranslations } from "next-intl";
import { usePathLocale } from "@/lib/locale/utils";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";

const order: Record<string, number> = {
  born: 1,
  resided: 2,
  visited: 3,
  died: 4,
};

export default function InfoDialog({
  result,
}: {
  result: ComponentProps<typeof BookSearchResult>["result"];
}) {
  const { document } = result;
  const [open, setOpen] = useState(false);
  const pathLocale = usePathLocale();
  const t = useTranslations();

  const shouldFetch = open;

  const { data: author, isFetching } = useQuery({
    queryKey: ["author", document.authorId] as const,
    queryFn: ({ queryKey }) => {
      const [, authorId] = queryKey;
      return findAuthorBySlug(authorId, pathLocale);
    },
    enabled: shouldFetch,
  });

  const primaryTitle = author?.primaryNameTranslations
    ? getPrimaryLocalizedText(author?.primaryNameTranslations, pathLocale)
    : null;
  const secondaryTitle = author?.primaryNameTranslations
    ? getSecondaryLocalizedText(author?.primaryNameTranslations, pathLocale)
    : null;

  const authorPrimaryName = author
    ? getPrimaryLocalizedText(author?.primaryNameTranslations, pathLocale)
    : null;
  const authorSecondaryName = author
    ? getSecondaryLocalizedText(author?.primaryNameTranslations, pathLocale)
    : null;

  const authorOtherPrimaryNames = author
    ? getPrimaryLocalizedText(author?.otherNameTranslations, pathLocale)
    : null;
  const authorOtherSecondaryNames = author
    ? getSecondaryLocalizedText(author?.otherNameTranslations, pathLocale)
    : null;

  const parsedRegions = useMemo(() => {
    if (!author) return [];

    if ("locations" in author) {
      return author.locations
        .filter((l) => !!l.region)
        .map((location) => {
          const region = location.region!;
          const typeKey = `common.${location.type.toLowerCase()}` as any;
          const localizedType = t(typeKey);

          return {
            id: location.id,
            type: localizedType === typeKey ? location.type : localizedType,
            slug: region.slug,
            name: getPrimaryLocalizedText(region.nameTranslations, pathLocale),
          };
        })
        .sort((a, b) => order[a.type]! - order[b.type]!);
    }

    return [];
  }, [author, pathLocale, t]);

  const isLoading = isFetching || !author;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="pointer-events-none absolute top-3 z-10 bg-background/80 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 ltr:right-3 rtl:left-3"
        onClick={() => setOpen(true)}
      >
        <InformationCircleIcon className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              <h3 className="text-2xl font-bold">
                {t("common.arabic-names")}:
              </h3>
              {isLoading ? (
                <div>
                  <Skeleton className="h-8 w-40 max-w-full" />

                  <Skeleton className="mt-2 h-6 w-64 max-w-full" />
                </div>
              ) : (
                <div>
                  <p className="text-xl">{primaryTitle}</p>

                  {primaryTitle && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {authorOtherPrimaryNames &&
                      authorOtherPrimaryNames.length > 0
                        ? authorOtherPrimaryNames.join(", ")
                        : "-"}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <h3 className="text-2xl font-bold">{t("common.latin-names")}:</h3>

              {isLoading ? (
                <div>
                  <Skeleton className="h-8 w-40 max-w-full" />

                  <Skeleton className="mt-2 h-6 w-64 max-w-full" />
                </div>
              ) : (
                <div>
                  <p className="text-xl">{secondaryTitle}</p>

                  {secondaryTitle && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {authorOtherSecondaryNames &&
                      authorOtherSecondaryNames.length > 0
                        ? authorOtherSecondaryNames.join(", ")
                        : "-"}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <h3 className="text-2xl font-bold">{t("entities.year")}:</h3>
              {isLoading ? (
                <div>
                  <Skeleton className="h-8 w-28 max-w-full" />
                </div>
              ) : (
                <div>
                  <Button
                    variant="link"
                    className="p-0 text-xl"
                    dir="ltr"
                    asChild
                  >
                    <Link href={navigation.centuries.byYear(author.year)}>
                      {t("common.year-format.ah.value", { year: author.year })}
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-5">
                <h3 className="text-2xl font-bold">
                  {t("common.author-arabic-names")}:
                </h3>
                {isLoading ? (
                  <div>
                    <Skeleton className="h-8 w-40 max-w-full" />

                    <Skeleton className="mt-2 h-6 w-64 max-w-full" />
                  </div>
                ) : (
                  <div>
                    {authorPrimaryName ? (
                      <Link
                        href={navigation.authors.bySlug(author.slug)}
                        className="text-xl text-primary hover:underline"
                      >
                        {authorPrimaryName}
                      </Link>
                    ) : (
                      <p className="text-sm text-muted-foreground">-</p>
                    )}

                    <p className="mt-2 text-sm text-muted-foreground">
                      {(authorOtherPrimaryNames ?? []).length > 0
                        ? authorOtherPrimaryNames!.join(", ")
                        : "-"}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-5">
                <h3 className="text-2xl font-bold">
                  {t("common.author-latin-names")}:
                </h3>
                {isLoading ? (
                  <div>
                    <Skeleton className="h-8 w-40 max-w-full" />

                    <Skeleton className="mt-2 h-6 w-64 max-w-full" />
                  </div>
                ) : (
                  <div>
                    {authorSecondaryName ? (
                      <Link
                        href={navigation.authors.bySlug(author.slug)}
                        className="text-xl text-primary hover:underline"
                      >
                        {authorSecondaryName}
                      </Link>
                    ) : (
                      <p className="text-sm text-muted-foreground">-</p>
                    )}

                    <p className="mt-2 text-sm text-muted-foreground">
                      {(authorOtherSecondaryNames ?? []).length > 0
                        ? authorOtherSecondaryNames!.join(", ")
                        : "-"}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-5">
                <h3 className="text-2xl font-bold">
                  {t("common.author-bio")}:
                </h3>
                {isLoading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-2.5 w-full" />
                    <Skeleton className="h-2.5 w-full" />
                    <Skeleton className="h-2.5 w-full" />
                    <Skeleton className="h-2.5 w-full" />
                    <Skeleton className="h-2.5 w-full" />
                    <Skeleton className="h-2.5 w-full" />
                    <Skeleton className="h-2.5 w-1/3" />
                  </div>
                ) : (
                  <div>
                    <p className="text-lg">
                      {getPrimaryLocalizedText(
                        author.bioTranslations,
                        pathLocale,
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-5">
                <h3 className="text-2xl font-bold">
                  {t("common.author-regions")}:
                </h3>
                {isLoading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-40 max-w-full" />
                    <Skeleton className="h-3 w-40 max-w-full" />
                    <Skeleton className="h-3 w-40 max-w-full" />
                    <Skeleton className="h-3 w-40 max-w-full" />
                  </div>
                ) : (
                  <div>
                    {parsedRegions.length > 0 ? (
                      <ul>
                        {parsedRegions.map((region) => (
                          <li
                            key={region.id}
                            className="flex items-center gap-1 text-lg capitalize"
                          >
                            <span>-</span>

                            <Link
                              className="ml-2 text-primary hover:underline"
                              href={navigation.regions.bySlug(region.slug)}
                            >
                              {region.name}
                            </Link>

                            <span>({region.type})</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">-</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
