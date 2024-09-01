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
  const { pagesRange } = usePageNavigation(bookResponse);
  const direction = getLocaleDirection(locale as any);

  const book = bookResponse.book;
  const author = book.author;

  const primaryName = getPrimaryLocalizedText(
    book.primaryNameTranslations,
    pathLocale,
  );
  const authorName = getPrimaryLocalizedText(
    author.primaryNameTranslations,
    pathLocale,
  );
  const authorBio = getPrimaryLocalizedText(author.bioTranslations, pathLocale);

  const primaryOtherNames =
    getPrimaryLocalizedText(book.otherNameTranslations, pathLocale) ?? [];
  const secondaryOtherNames =
    getSecondaryLocalizedText(book.otherNameTranslations, pathLocale) ?? [];

  const headings = bookResponse.turathResponse
    ? bookResponse.turathResponse.indexes.headings
    : bookResponse.headers;

  const pageToIndex = bookResponse.pageNumberToIndex;
  const chapterIndexToPageIndex = bookResponse.chapterIndexToPageIndex;

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

          <VersionSelector versions={book.versions} />
        </div>

        <div className="w-full pb-2 pt-4">
          <PdfButton
            pdf={bookResponse.turathResponse?.meta.pdf_links}
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

            <AccordionContent className="flex flex-col gap-5">
              <div>
                <p className="font-semibold">{t("reader.other-titles")}:</p>

                <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                  <p>
                    {primaryOtherNames.length > 0
                      ? primaryOtherNames.join(", ")
                      : "-"}
                  </p>

                  <p>
                    {secondaryOtherNames.length > 0
                      ? secondaryOtherNames.join(", ")
                      : "-"}
                  </p>
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

      <Separator className="my-4" />

      <SidebarContainer className="flex flex-col gap-3">
        {(bookResponse.turathResponse
          ? bookResponse.turathResponse.indexes.headings
          : bookResponse.headers
        ).length > 0 && (
          <div className="w-full">
            <PageNavigator range={pagesRange} pageToIndex={pageToIndex} />
          </div>
        )}

        <ChaptersList
          pagesRange={pagesRange}
          headers={headings}
          pageToIndex={pageToIndex}
          chapterIndexToPageIndex={chapterIndexToPageIndex}
        />
      </SidebarContainer>

      <div className="h-16" />
    </>
  );
}
