import { ChevronRightIcon } from "@heroicons/react/20/solid";
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

const breadcrumbs = [
  "كتب الأخلاق والسلوك",
  "مجموعة ابن تيمية",
  "التزكية والسلوك",
];

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

export default async function ContentTab({ bookId }: { bookId: string }) {
  let result: Awaited<ReturnType<typeof fetchBook>>;

  try {
    result = await fetchBook(bookId);
  } catch (e) {
    notFound();
  }

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
        <h2 className="flex gap-2 text-4xl font-bold">
          {book.primaryArabicName}
        </h2>

        <div className="mt-6 flex items-center text-accent-foreground">
          <HoverCard>
            <HoverCardTrigger asChild>
              <p>
                <Link
                  href={navigation.authors.bySlug(author.slug)}
                  className="text-sm hover:underline"
                >
                  {author.primaryArabicName}
                </Link>
              </p>
            </HoverCardTrigger>

            <HoverCardContent className="text-muted-foreground">
              <p className="text-sm">{author.otherArabicNames.join(", ")}</p>

              <p className="mt-5 text-sm">
                {author.otherLatinNames.join(", ")}
              </p>
            </HoverCardContent>
          </HoverCard>

          <span className="mx-3 text-muted-foreground">•</span>

          <Button variant="link" className="p-0 text-sm" dir="ltr" asChild>
            <Link href={navigation.centuries.byYear(author.year)}>
              {author.year} AH
            </Link>
          </Button>

          {/* <span className="mx-3 text-gray-400">•</span>

                <p className="text-sm text-gray-700" dir="ltr">
                  {book.versions.length} versions
                </p> */}
        </div>

        <div className="flex w-full flex-row-reverse items-center justify-between gap-4 pb-2 pt-6">
          <Label htmlFor="version-selector" className="font-normal">
            Version
          </Label>

          <VersionSelector versionIds={book.versionIds} />
        </div>
      </SidebarContainer>

      <Separator className="my-4" />

      <SidebarContainer>
        <Accordion type="single" collapsible>
          <AccordionItem value="info" className="border-none">
            <AccordionTrigger className="flex-row-reverse py-3 font-normal">
              More Info
            </AccordionTrigger>

            <AccordionContent dir="ltr" className="flex flex-col gap-5">
              <div>
                <p className="font-semibold">Other titles:</p>

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
                <p className="font-semibold">Tags:</p>

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
          <div className="flex justify-end">
            <PageNavigator range={pagesRange} />
          </div>
        )}

        <ChaptersList pagesRange={pagesRange} headers={result.headers} />
      </SidebarContainer>

      <div className="h-16" />
    </>
  );
}
