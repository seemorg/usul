"use client";

import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  RawDialogClose,
  RawDialogContent,
} from "@/components/ui/dialog";
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
import { XIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import type { GenreDocument } from "@/types/genre";

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

  const primaryTitle = document?.primaryNames
    ? getPrimaryLocalizedText(document.primaryNames, pathLocale)
    : null;

  const otherTitles = document?.otherNames
    ? getPrimaryLocalizedText(document.otherNames, pathLocale)
    : null;

  const secondaryTitle = document?.primaryNames
    ? getSecondaryLocalizedText(document.primaryNames, pathLocale)
    : null;

  const otherSecondaryTitles = document?.otherNames
    ? getSecondaryLocalizedText(document.otherNames, pathLocale)
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

  const genres = ((document as any).genres ?? []) as GenreDocument[];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="pointer-events-none absolute top-3 z-10 bg-background opacity-0 hover:bg-background/80 focus:bg-background/80 group-hover:pointer-events-auto group-hover:opacity-100 ltr:right-3 rtl:left-3"
        onClick={() => setOpen(true)}
      >
        <InformationCircleIcon className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay>
            <RawDialogContent className="relative z-50 grid w-full max-w-3xl gap-4 bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[5%] data-[state=open]:slide-in-from-top-[5%] sm:rounded-lg">
              <div className="w-full bg-primary px-8 py-6 text-white sm:rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">
                    {t("common.text-info")}
                  </h3>
                  <RawDialogClose className="rounded-sm p-2 opacity-70 ring-offset-background transition-opacity hover:bg-white/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                    <XIcon className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                  </RawDialogClose>
                </div>

                <Separator className="my-6 bg-white/10" />

                <div className="flex justify-between">
                  <div className="w-full flex-1">
                    <p className="mb-2 text-base font-medium text-white/60">
                      {t("common.names")}
                    </p>

                    <div>
                      <p className="text-xl font-bold">{primaryTitle}</p>

                      {otherTitles && (
                        <p className="mt-3 text-sm text-muted">
                          {otherTitles.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-full flex-1" dir="rtl">
                    <p className="mb-2 text-base font-medium text-white/60">
                      الاسم
                    </p>

                    <div>
                      <p className="text-xl font-bold">{secondaryTitle}</p>

                      {otherSecondaryTitles && (
                        <p className="mt-3 text-sm text-muted">
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
                          className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
                        >
                          {getPrimaryLocalizedText(
                            genre.nameTranslations,
                            pathLocale,
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-6 px-8 py-6">
                <h3 className="text-2xl font-bold">
                  {t("common.author-info")}
                </h3>

                <div className="flex justify-between">
                  <div className="w-full flex-1">
                    <p className="mb-2 text-base font-medium text-secondary-foreground/60">
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
                            <p className="mt-3 text-sm text-secondary-foreground">
                              {authorOtherPrimaryNames.join(", ")}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="w-full flex-1" dir="rtl">
                    <p className="mb-2 text-base font-medium text-secondary-foreground/60">
                      الاسم
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
                            <p className="mt-3 text-sm text-secondary-foreground">
                              {authorOtherSecondaryNames.join(", ")}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-base font-medium text-secondary-foreground/60">
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
                    <p className="text-base font-medium text-secondary-foreground/60">
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
                                  className="ml-2 text-primary hover:underline"
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
                          <p className="text-sm text-muted-foreground">-</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-base font-medium text-secondary-foreground/60">
                      {t("entities.year")}
                    </p>

                    {isLoading ? (
                      <div>
                        <Skeleton className="h-8 w-28 max-w-full" />
                      </div>
                    ) : (
                      <div>
                        <Link
                          href={navigation.centuries.byYear(author.year)}
                          prefetch
                          dir="ltr"
                          className="text-lg text-primary underline-offset-4 hover:underline"
                        >
                          {t("common.year-format.ah.value", {
                            year: author.year,
                          })}
                        </Link>
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
