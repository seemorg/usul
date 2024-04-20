/* eslint-disable react/jsx-key */
// import { ChevronRightIcon } from "@heroicons/react/20/solid";
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
import { fetchBook } from "@/server/services/books";
import { Label } from "@/components/ui/label";
import SidebarContainer from "../sidebar-container";
import { notFound } from "next/navigation";
import VersionSelector from "./version-selector";
import PageNavigator from "./page-navigator";
import ChaptersList from "./chapters-section";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import DottedList from "@/components/ui/dotted-list";
import { getLocaleDirection } from "@/lib/locale/client";
import { getLocale } from "@/lib/locale/server";

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

interface ContentTabProps {
  bookId: string;
}

export default async function ContentTab({ bookId }: ContentTabProps) {
  let result: Awaited<ReturnType<typeof fetchBook>>;

  try {
    result = await fetchBook(bookId);
  } catch (e) {
    notFound();
  }

  const t = await getTranslations();
  const locale = await getLocale();
  const direction = getLocaleDirection(locale as any);

  const book = result.book;
  const author = book.author;

  const firstPage = result.pages[0]?.page?.page ?? 0;
  const lastPage = result.pages[result.pages.length - 1]?.page?.page ?? 0;
  const pagesRange = {
    start: typeof firstPage === "number" ? firstPage : 0,
    end: typeof lastPage === "number" ? lastPage : 0,
  };

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
          {book.primaryArabicName}
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
                      {author.primaryArabicName}
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
                  {author.bio}
                </p>
              </HoverCardContent>
            </HoverCard>,
          ]}
        />

        <div className="flex w-full items-center justify-between gap-4 pb-2 pt-6">
          <Label htmlFor="version-selector" className="font-normal">
            {t("reader.version")}
          </Label>

          <VersionSelector versionIds={book.versionIds} />
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
                    {book.otherArabicNames.length > 0
                      ? book.otherArabicNames.join(", ")
                      : "-"}
                  </p>

                  <p>
                    {book.otherLatinNames.length > 0
                      ? book.otherLatinNames.join(", ")
                      : "-"}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-semibold">{t("entities.genres")}:</p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {book.genres.map(({ genre }) => (
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
        {result.headers.length > 0 && (
          <div className="w-full">
            <PageNavigator range={pagesRange} />
          </div>
        )}

        <ChaptersList pagesRange={pagesRange} headers={result.headers} />
      </SidebarContainer>

      <div className="h-16" />
    </>
  );
}
