"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { useDirection } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import type { ApiBookResponse } from "@/types/ApiBookResponse";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";
import { useBoolean } from "usehooks-ts";

export default function BookInfoHeader({
  bookResponse,
}: {
  bookResponse: ApiBookResponse;
}) {
  const open = useBoolean(false);
  const dir = useDirection();
  const t = useTranslations();

  const book = bookResponse.book;
  const {
    primaryName,
    secondaryName,
    author: {
      primaryName: authorPrimaryName,
      secondaryName: authorSecondaryName,
      year,
    },
    genres,
  } = book;

  const ToggleButton = () => (
    <Button
      size="icon"
      variant="ghost"
      className="hover:bg-accent/70 focus:bg-accent/70"
      onClick={open.toggle}
      id="book-info-header-toggle-button"
    >
      {open.value ? (
        <ChevronUpIcon className="size-4" />
      ) : (
        <ChevronDownIcon className="size-4" />
      )}
    </Button>
  );

  const AuthorHoverCard = ({ children }: { children: React.ReactNode }) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span>{children}</span>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-full max-w-[400px] text-muted-foreground"
        avoidCollisions
        side="left"
      >
        <p className="line-clamp-4 text-ellipsis text-sm">{book.author.bio}</p>
      </HoverCardContent>
    </HoverCard>
  );

  const bookContent = bookResponse.content;
  const isExternal = bookContent.source === "external";
  const publicationDetails = !isExternal ? bookContent.publicationDetails : {};

  const renderPublicationDetails = () => {
    if (!publicationDetails) return null;

    const final: { title: string; text: string | React.ReactNode }[] = [];

    if (publicationDetails.title)
      final.push({
        title: t("reader.publication-details.book-title"),
        text: publicationDetails.title,
      });

    if (publicationDetails.author)
      final.push({
        title: t("reader.publication-details.author"),
        text: publicationDetails.author,
      });

    if (publicationDetails.editor)
      final.push({
        title: t("reader.publication-details.editor"),
        text: publicationDetails.editor,
      });

    if (publicationDetails.publisher)
      final.push({
        title: t("reader.publication-details.publisher"),
        text: publicationDetails.publisher,
      });

    if (publicationDetails.printVersion)
      final.push({
        title: t("reader.publication-details.print-version"),
        text: publicationDetails.printVersion,
      });

    if (publicationDetails.volumes)
      final.push({
        title: t("reader.publication-details.volumes"),
        text: publicationDetails.volumes,
      });

    if (publicationDetails.pageNumbersMatchPrint !== undefined)
      final.push({
        title: t("reader.publication-details.page-numbers-match-print"),
        text: publicationDetails.pageNumbersMatchPrint ? (
          <CheckIcon className="size-4" />
        ) : (
          <XIcon className="size-4" />
        ),
      });

    return final;
  };

  return (
    <Container
      className="mx-auto border-b border-border px-5 py-2.5 lg:px-8 2xl:max-w-5xl"
      dir={dir}
    >
      {!open.value && (
        <div className="flex justify-between">
          <div className="flex items-center gap-3 text-base font-semibold">
            {[
              // eslint-disable-next-line react/jsx-key
              <p>{book.primaryName}</p>,
              book.secondaryName ? <p>{book.secondaryName}</p> : null,
              // eslint-disable-next-line react/jsx-key
              <bdi>
                <Link
                  href={navigation.authors.bySlug(book.author.slug)}
                  className="text-primary underline underline-offset-4"
                  prefetch
                >
                  {book.author.primaryName}
                  {book.author.year
                    ? ` - ${t("common.year-format.ah.value", { year: book.author.year })}`
                    : ""}
                </Link>
              </bdi>,
            ]
              .filter(Boolean)
              .map((item, index, arr) => (
                <Fragment key={index}>
                  {item}
                  {index < arr.length - 1 && (
                    <Separator orientation="vertical" className="h-6" />
                  )}
                </Fragment>
              ))}
          </div>

          <ToggleButton />
        </div>
      )}

      {open.value && (
        <div className="mt-5">
          <div className="flex justify-between">
            <bdi className="flex-1">
              <h2 className="text-3xl font-bold">{primaryName}</h2>
            </bdi>

            {secondaryName && (
              <bdi className="flex-1">
                <h2 className="text-3xl font-bold">{secondaryName}</h2>
              </bdi>
            )}
          </div>

          <div className="mt-5 flex justify-between">
            <div>
              <AuthorHoverCard>
                <Link
                  href={navigation.authors.bySlug(book.author.slug)}
                  className="text-primary underline underline-offset-4"
                  prefetch
                >
                  {authorPrimaryName} -{" "}
                  {t("common.year-format.ah.value", { year })}
                </Link>
              </AuthorHoverCard>
            </div>

            {authorSecondaryName && (
              <bdi>
                <AuthorHoverCard>
                  <Link
                    href={navigation.authors.bySlug(book.author.slug)}
                    className="text-primary underline underline-offset-4"
                    prefetch
                  >
                    {authorSecondaryName} -{" "}
                    {t("common.year-format.ah.value", { year })}
                  </Link>
                </AuthorHoverCard>
              </bdi>
            )}
          </div>

          {publicationDetails && (
            <div className="relative mt-10 flex flex-wrap items-center gap-5 text-sm">
              {renderPublicationDetails()!.map((item, index, arr) => (
                <Fragment key={index}>
                  <div>
                    <p>{item.title}</p>
                    <bdi className="mt-1 block font-semibold">{item.text}</bdi>
                  </div>

                  {index < arr.length - 1 && (
                    <Separator orientation="vertical" className="h-12" />
                  )}
                </Fragment>
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-between">
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={navigation.genres.bySlug(genre.slug)}
                  prefetch
                >
                  <Badge variant="outline" className="text-sm">
                    {genre.name}
                  </Badge>
                </Link>
              ))}
            </div>

            <ToggleButton />
          </div>
        </div>
      )}
    </Container>
  );
}
