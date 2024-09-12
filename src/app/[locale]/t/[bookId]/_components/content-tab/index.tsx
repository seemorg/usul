/* eslint-disable react/jsx-key */
"use client";

import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import SidebarContainer from "../sidebar/sidebar-container";
import VersionSelector from "./version-selector";
import PageNavigator from "./page-navigator";
import ChaptersList from "./chapters-section";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import { Button } from "@/components/ui/button";
import DottedList from "@/components/ui/dotted-list";
import { getLocaleDirection, usePathLocale } from "@/lib/locale/utils";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import PdfButton from "./pdf-button";
import type { TabProps } from "../sidebar/tabs";
import { useLocale, useTranslations } from "next-intl";
import { usePageNavigation } from "../usePageNavigation";
import { CheckIcon, XIcon } from "lucide-react";

// const breadcrumbs = [
//   "كتب الأخلاق والسلوك",
//   "مجموعة ابن تيمية",
//   "التزكية والسلوك",
// ];

// const fakeChapters = [
//   {
//     title: "المقدمه",
//     page: 228,
//   },
//   {
//     title: "الفصل الأول",
//     page: 230,
//   },
//   {
//     title: "الفصل الثاني",
//     page: 253,
//   },
//   {
//     title: "الفصل الثالث",
//     page: 270,
//   },
//   {
//     title: "الفصل الرابع",
//     page: 300,
//   },
//   {
//     title: "الفصل الخامس",
//     page: 320,
//   },
//   {
//     title: "الفصل السادس",
//     page: 340,
//   },
//   {
//     title: "الفصل السابع",
//     page: 360,
//   },
//   {
//     title: "الفصل الثامن",
//     page: 380,
//   },
// ];

export default function ContentTab({ bookResponse }: TabProps) {
  const pathLocale = usePathLocale();
  const t = useTranslations();
  const locale = useLocale();
  const { pagesRange, getVirtuosoIndex } = usePageNavigation(bookResponse);
  const direction = getLocaleDirection(locale as any);

  const book = bookResponse.book;
  const author = book.author;

  const primaryName =
    pathLocale === "en" && book.transliteration
      ? book.transliteration
      : getPrimaryLocalizedText(book.primaryNameTranslations, pathLocale);

  const authorName =
    pathLocale === "en" && author.transliteration
      ? author.transliteration
      : getPrimaryLocalizedText(author.primaryNameTranslations, pathLocale);

  const authorBio = getPrimaryLocalizedText(author.bioTranslations, pathLocale);

  const primaryOtherNames =
    getPrimaryLocalizedText(book.otherNameTranslations, pathLocale) ?? [];
  const secondaryOtherNames =
    getSecondaryLocalizedText(book.otherNameTranslations, pathLocale) ?? [];

  const headings =
    bookResponse.source === "turath"
      ? bookResponse.turathResponse.headings
      : bookResponse.source === "openiti"
        ? bookResponse.headers
        : [];

  const chapterIndexToPageIndex =
    bookResponse.source === "turath"
      ? bookResponse.chapterIndexToPageIndex
      : null;

  const publicationDetails =
    bookResponse.source === "turath"
      ? bookResponse.turathResponse.publicationDetails
      : {};

  return (
    <>
      <SidebarContainer>
        {/* <nav className="flex" aria-label="Breadcrumb" dir="rtl">
          <ol role="list" className="flex flex-wrap items-center gap-y-2">
            {breadcrumbs.map((b, idx) => (
              <li key={idx}>
                <div className={cn(idx > 0 && "flex items-center")}>
                  {idx > 0 && (
                    <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400 rtl:rotate-180" />
                  )}

                  <a
                    href="#"
                    className={cn(
                      "text-xs font-medium text-gray-500 hover:text-gray-700 ltr:ml-0.5 rtl:mr-0.5",
                    )}
                  >
                    {b}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </nav> */}
        {/* mt-6  */}
        <h2 className="flex gap-2 text-4xl font-bold" dir="rtl">
          {primaryName}
        </h2>

        <DottedList
          className="mt-6 ltr:justify-end"
          items={[
            <Button variant="link" className="p-0 text-sm" asChild>
              <Link
                href={navigation.centuries.byYear(author.year)}
                dir={direction}
              >
                {t("common.year-format.ah.value", { year: author.year })}
              </Link>
            </Button>,
            <HoverCard>
              <HoverCardTrigger asChild>
                <p dir="rtl">
                  <Button variant="link" asChild className="px-0 text-base">
                    <Link href={navigation.authors.bySlug(author.slug)}>
                      {authorName}
                    </Link>
                  </Button>
                </p>
              </HoverCardTrigger>

              <HoverCardContent
                className=" w-full max-w-[400px] text-muted-foreground"
                avoidCollisions
                side="left"
              >
                <p className="line-clamp-4 text-ellipsis text-sm">
                  {authorBio}
                </p>
              </HoverCardContent>
            </HoverCard>,
          ]}
        />

        <div className="flex w-full items-center justify-between gap-4 pb-2 pt-6">
          <Label htmlFor="version-selector" className="font-normal">
            {t("reader.version")}
          </Label>

          <VersionSelector
            versions={book.versions}
            versionId={bookResponse.versionId}
          />
        </div>

        <div className="w-full pb-2 pt-4">
          <PdfButton
            pdf={
              bookResponse.source === "turath"
                ? bookResponse.turathResponse.pdf
                : null
            }
            slug={bookResponse.book.slug}
          />
        </div>
      </SidebarContainer>

      <Separator className="my-4" />

      <SidebarContainer>
        <Accordion type="single" collapsible>
          <AccordionItem value="info" className="border-none">
            <AccordionTrigger className="py-3 font-normal">
              {t("reader.more-info")}
            </AccordionTrigger>

            <AccordionContent className="flex flex-col gap-8">
              <div>
                <p className="font-semibold">{t("reader.other-titles")}:</p>

                <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                  {primaryOtherNames.length > 0 && (
                    <p>{primaryOtherNames.join(", ")}</p>
                  )}

                  {secondaryOtherNames.length > 0 && (
                    <p>{secondaryOtherNames.join(", ")}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="font-semibold">
                  {t("reader.publication-details.title")}:
                </p>

                <div className="mt-3 flex flex-col gap-3">
                  {publicationDetails.title && (
                    <p>
                      {t("reader.publication-details.book-title")}:{" "}
                      <span dir="rtl">{publicationDetails.title}</span>
                    </p>
                  )}
                  {publicationDetails.author && (
                    <p>
                      {t("reader.publication-details.author")}:{" "}
                      <span dir="rtl">{publicationDetails.author}</span>
                    </p>
                  )}
                  {publicationDetails.editor && (
                    <p>
                      {t("reader.publication-details.editor")}:{" "}
                      <span dir="rtl">{publicationDetails.editor}</span>
                    </p>
                  )}
                  {publicationDetails.publisher && (
                    <p>
                      {t("reader.publication-details.publisher")}:{" "}
                      <span dir="rtl">{publicationDetails.publisher}</span>
                    </p>
                  )}
                  {publicationDetails.printVersion && (
                    <p>
                      {t("reader.publication-details.print-version")}:{" "}
                      <span dir="rtl">{publicationDetails.printVersion}</span>
                    </p>
                  )}
                  {publicationDetails.volumes && (
                    <p>
                      {t("reader.publication-details.volumes")}:{" "}
                      <span dir="rtl">{publicationDetails.volumes}</span>
                    </p>
                  )}
                  {publicationDetails.pageNumbersMatchPrint !== undefined && (
                    <p className="flex items-center gap-1">
                      {t("reader.publication-details.page-numbers-match-print")}
                      :{" "}
                      {publicationDetails.pageNumbersMatchPrint ? (
                        <CheckIcon className="size-4" />
                      ) : (
                        <XIcon className="size-4" />
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="font-semibold">{t("entities.genres")}:</p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {book.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={navigation.genres.bySlug(genre.slug)}
                    >
                      <Badge
                        shape="pill"
                        variant="secondary"
                        className="font-normal"
                      >
                        {genre.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarContainer>

      {bookResponse.source === "external" ? null : (
        <>
          <Separator className="my-4" />

          <SidebarContainer className="flex flex-col gap-3">
            {(bookResponse.source === "turath"
              ? bookResponse.turathResponse.headings
              : bookResponse.headers
            ).length > 0 && (
              <div className="w-full">
                <PageNavigator
                  range={pagesRange}
                  getVirtuosoIndex={getVirtuosoIndex}
                />
              </div>
            )}

            <ChaptersList
              headers={headings}
              getVirtuosoIndex={getVirtuosoIndex}
              chapterIndexToPageIndex={chapterIndexToPageIndex}
              pagesRange={pagesRange}
            />
          </SidebarContainer>
        </>
      )}

      <div className="h-16" />
    </>
  );
}
