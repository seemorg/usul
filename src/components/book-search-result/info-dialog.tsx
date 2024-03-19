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
  const t = useTranslations();

  const shouldFetch = !document.author && open;

  const { data: author = document.author, isFetching } = useQuery({
    queryKey: ["author", document.authorId] as const,
    queryFn: ({ queryKey }) => {
      const [, authorId] = queryKey;
      return findAuthorBySlug(authorId);
    },
    enabled: shouldFetch,
  });

  const {
    primaryArabicName,
    primaryLatinName,
    otherArabicNames,
    otherLatinNames,
  } = document;

  const arabicTitle = primaryArabicName;
  const latinTitle = primaryLatinName;

  const authorArabicName = author?.primaryArabicName;
  const authorLatinName = author?.primaryLatinName;

  const authorOtherArabicNames = author?.otherArabicNames;
  const authorOtherLatinNames = author?.otherLatinNames;

  const parsedRegions = useMemo(() => {
    if (!author) return [];

    if ("locations" in author) {
      return author.locations
        .filter((l) => !!l.location.region)
        .map(({ location }) => {
          const region = location.region!;
          return {
            id: location.id,
            type: location.type,
            slug: region.slug,
            name: region.name,
          };
        })
        .sort((a, b) => order[a.type]! - order[b.type]!);
    }

    if ("regions" in author) {
      return author.regions
        .map((region) => {
          const [type = "", slug = ""] = region.split("@");

          return { id: region, type, slug, name: slug.replaceAll("-", " ") };
        })
        .sort((a, b) => order[a.type]! - order[b.type]!);
    }

    return [];
  }, [author]);

  const isLoading = isFetching || !author;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="pointer-events-none absolute top-3 z-10 bg-white/70 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 ltr:right-3 rtl:left-3"
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
                  <p className="text-xl">{arabicTitle}</p>

                  {arabicTitle && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {otherArabicNames.length > 0
                        ? otherArabicNames.join(", ")
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
                  <p className="text-xl">{latinTitle}</p>

                  {latinTitle && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {otherLatinNames.length > 0
                        ? otherLatinNames.join(", ")
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
                    {authorArabicName ? (
                      <Link
                        href={navigation.authors.bySlug(author.slug)}
                        className="text-xl text-primary hover:underline"
                      >
                        {authorArabicName}
                      </Link>
                    ) : (
                      <p className="text-sm text-muted-foreground">-</p>
                    )}

                    {authorArabicName && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {authorOtherArabicNames.length > 0
                          ? authorOtherArabicNames.join(", ")
                          : "-"}
                      </p>
                    )}
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
                    {authorLatinName ? (
                      <Link
                        href={navigation.authors.bySlug(author.slug)}
                        className="text-xl text-primary hover:underline"
                      >
                        {authorLatinName}
                      </Link>
                    ) : (
                      <p className="text-sm text-muted-foreground">-</p>
                    )}

                    {authorLatinName && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {authorOtherLatinNames.length > 0
                          ? authorOtherLatinNames.join(", ")
                          : "-"}
                      </p>
                    )}
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
                    <p className="text-lg">{author.bio}</p>
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
