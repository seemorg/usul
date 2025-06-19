"use client";

import type { GenreDocument } from "@/types/genre";
import type { ComponentProps } from "react";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  RawDialogClose,
  RawDialogContent,
  RawDialogTitle,
} from "@/components/ui/dialog";
import { useDirection, usePathLocale } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import { findAuthorBySlug } from "@/server/services/authors";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type BookSearchResult from ".";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

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
  const [open, setOpen] = useState(false);
  const pathLocale = usePathLocale();
  const t = useTranslations();
  const dir = useDirection();

  const shouldFetch = open;

  const { data: author, isFetching } = useQuery({
    queryKey: ["author", result.authorId, pathLocale] as const,
    queryFn: ({ queryKey }) => {
      const [, authorId, locale] = queryKey;
      return findAuthorBySlug(authorId, locale);
    },
    enabled: shouldFetch,
  });

  const primaryTitle = result.primaryName;
  const otherTitles = result.otherNames;

  const secondaryTitle = result.secondaryName;
  const otherSecondaryTitles = result.secondaryOtherNames;

  const authorPrimaryName = author
    ? getPrimaryLocalizedText(author.primaryNameTranslations, pathLocale)
    : null;
  const authorSecondaryName = author
    ? getSecondaryLocalizedText(author.primaryNameTranslations, pathLocale)
    : null;

  const authorOtherPrimaryNames = author
    ? getPrimaryLocalizedText(author.otherNameTranslations, pathLocale)
    : null;
  const authorOtherSecondaryNames = author
    ? getSecondaryLocalizedText(author.otherNameTranslations, pathLocale)
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

  const genres = result.genres ?? [];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="bg-background hover:bg-background/80 focus:bg-background/80 pointer-events-none absolute top-3 z-10 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 ltr:right-3 rtl:left-3"
        onClick={() => setOpen(true)}
      >
        <InformationCircleIcon className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="place-items-end pt-10 pb-0 sm:place-items-center sm:pt-40 sm:pb-20">
            <RawDialogContent className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[5%] data-[state=open]:slide-in-from-top-[5%] relative z-50 grid w-full max-w-3xl gap-4 shadow-lg duration-200 sm:rounded-lg">
              <div className="bg-primary w-full px-6 py-6 text-white sm:rounded-t-lg sm:px-8">
                <div className="flex items-center justify-between">
                  <RawDialogTitle className="text-2xl font-bold">
                    {t("common.text-info")}
                  </RawDialogTitle>
                  <RawDialogClose className="ring-offset-background focus:ring-ring rounded-sm p-2 opacity-70 transition-opacity hover:bg-white/10 hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
                    <XIcon className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                  </RawDialogClose>
                </div>

                <Separator className="my-4 bg-white/10 sm:my-6" />

                <div className="flex justify-between">
                  <div className="w-full flex-1">
                    <p className="mb-2 text-base font-medium text-white/60">
                      {t("common.names")}
                    </p>

                    <div>
                      <p className="text-xl font-bold">{primaryTitle}</p>

                      {otherTitles && (
                        <p className="text-muted mt-3 text-sm">
                          {otherTitles.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className="w-full flex-1"
                    dir={dir === "ltr" ? "rtl" : "ltr"}
                  >
                    <p className="mb-2 text-base font-medium text-white/60">
                      {pathLocale === "ar" ? "Name" : "الاسم"}
                    </p>

                    <div>
                      <p className="text-xl font-bold">{secondaryTitle}</p>

                      {otherSecondaryTitles && (
                        <p className="text-muted mt-3 text-sm">
                          {otherSecondaryTitles.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {genres.length > 0 && (
                  <div className="mt-6">
                    <p className="mb-2 text-base font-medium text-white/60">
                      {t("entities.genres")}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {genres.map((genre) => (
                        <Link
                          key={genre.id}
                          href={navigation.genres.bySlug(genre.slug)}
                          // className="rounded-md bg-muted px-3 py-1 text-sm font-medium text-muted-foreground"
                          className="text-muted-foreground hover:bg-accent rounded-lg bg-white px-3 py-1.5 text-sm font-medium transition-colors"
                        >
                          {genre.primaryName}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 px-6 py-6 sm:gap-6 sm:px-8">
                <h3 className="text-2xl font-bold">
                  {t("common.author-info")}
                </h3>

                <div className="flex justify-between">
                  <div className="w-full flex-1">
                    <p className="text-secondary-foreground/60 mb-2 text-base font-medium">
                      {t("common.names")}
                    </p>

                    <div className="w-full">
                      {isLoading ? (
                        <>
                          <Skeleton className="h-8 w-40 max-w-full" />
                          <Skeleton className="mt-2 h-6 w-64 max-w-full" />
                        </>
                      ) : (
                        <>
                          <p className="text-xl font-bold">
                            {authorPrimaryName}
                          </p>

                          {authorOtherPrimaryNames && (
                            <p className="text-secondary-foreground mt-3 text-sm">
                              {authorOtherPrimaryNames.join(", ")}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {!isLoading && (
                    <div
                      className="w-full flex-1"
                      dir={dir === "ltr" ? "rtl" : "ltr"}
                    >
                      <p className="text-secondary-foreground/60 mb-2 text-base font-medium">
                        {pathLocale === "ar" ? "Name" : "الاسم"}
                      </p>

                      <div className="w-full">
                        {isLoading ? (
                          <>
                            <Skeleton className="h-8 w-40 max-w-full" />
                            <Skeleton className="mt-2 h-6 w-64 max-w-full" />
                          </>
                        ) : (
                          <>
                            <p className="text-xl font-bold">
                              {authorSecondaryName}
                            </p>

                            {authorOtherSecondaryNames && (
                              <p className="text-secondary-foreground mt-3 text-sm">
                                {authorOtherSecondaryNames.join(", ")}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-secondary-foreground/60 text-base font-medium">
                    {t("common.author-bio")}
                  </p>

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
                    <p>
                      {getPrimaryLocalizedText(
                        author.bioTranslations,
                        pathLocale,
                      )}
                    </p>
                  )}
                </div>

                <div className="flex gap-32">
                  <div className="flex flex-col gap-2">
                    <p className="text-secondary-foreground/60 text-base font-medium">
                      {t("common.author-regions")}
                    </p>

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
                                  className="text-primary ml-2 hover:underline"
                                  href={navigation.regions.bySlug(region.slug)}
                                  prefetch
                                >
                                  {region.name}
                                </Link>

                                <span>({region.type})</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground text-sm">-</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-secondary-foreground/60 text-base font-medium">
                      {t("entities.year")}
                    </p>

                    {isLoading ? (
                      <div>
                        <Skeleton className="h-8 w-28 max-w-full" />
                      </div>
                    ) : (
                      <div>
                        {author.year ? (
                          <Link
                            href={navigation.centuries.byYear(author.year)}
                            prefetch
                            dir="ltr"
                            className="text-primary text-lg underline-offset-4 hover:underline"
                          >
                            {t("common.year-format.ah.value", {
                              year: author.year,
                            })}
                          </Link>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </RawDialogContent>
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
    </>
  );
}
