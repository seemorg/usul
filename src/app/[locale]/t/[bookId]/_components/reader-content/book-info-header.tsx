"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import type { ApiBookResponse } from "@/types/ApiBookResponse";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useBoolean } from "usehooks-ts";

export default function BookInfoHeader({
  bookResponse,
}: {
  bookResponse: ApiBookResponse;
}) {
  const open = useBoolean(false);

  const book = bookResponse.book;
  const {
    primaryName,
    secondaryName,
    otherNames,
    secondaryOtherNames,
    author: {
      primaryName: authorPrimaryName,
      secondaryName: authorSecondaryName,
      otherNames: authorOtherNames,
      secondaryOtherNames: authorSecondaryOtherNames,
      year,
    },
    genres,
  } = book;

  return (
    <Container
      className="mx-auto px-5 lg:px-8 xl:px-16 2xl:max-w-5xl"
      dir="ltr"
    >
      <div className="flex justify-between">
        <div className="flex items-center divide-x-2 divide-border text-base">
          <p className="px-3">
            <strong>Book Info</strong>
          </p>
          <p className="px-3">
            <strong>Print Version</strong> 01
          </p>
          <p className="px-3">
            <strong>Volumes</strong> 01
          </p>
        </div>

        <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          onClick={open.toggle}
        >
          {open.value ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
        </Button>
      </div>

      {open.value && (
        <div className="mt-5 ">
          <div className="flex justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{primaryName}</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                {otherNames.join(",")}
              </p>
            </div>

            <div className="flex-1" dir="rtl">
              <h2 className="text-2xl font-bold">{secondaryName}</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                {(secondaryOtherNames ?? []).join(",")}
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-between">
            <div>
              <Link
                href={navigation.authors.bySlug(book.author.slug)}
                className="text-primary underline"
              >
                {authorPrimaryName} (d. {year})
              </Link>

              <p className="mt-2 text-sm text-muted-foreground">
                {authorOtherNames.join(",")}
              </p>
            </div>

            <div dir="rtl">
              <Link
                href={navigation.authors.bySlug(book.author.slug)}
                className="text-primary underline"
              >
                {authorSecondaryName} (ت. {year})
              </Link>

              <p className="mt-2 text-sm text-muted-foreground">
                {(authorSecondaryOtherNames ?? []).join(",")}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Link key={genre.id} href={navigation.genres.bySlug(genre.slug)}>
                <Badge variant="outline" className="text-sm">
                  {genre.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
