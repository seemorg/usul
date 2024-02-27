import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";
import { fetchBook } from "@/lib/book";
import { Label } from "@/components/ui/label";
import SidebarContainer from "../sidebar-container";
import { notFound } from "next/navigation";
import VersionSelector from "./version-selector";

const breadcrumbs = [
  "كتب الأخلاق والسلوك",
  "مجموعة ابن تيمية",
  "التزكية والسلوك",
];

const fakeChapters = [
  {
    title: "المقدمه",
    page: 228,
  },
  {
    title: "الفصل الأول",
    page: 230,
  },
  {
    title: "الفصل الثاني",
    page: 253,
  },
  {
    title: "الفصل الثالث",
    page: 270,
  },
  {
    title: "الفصل الرابع",
    page: 300,
  },
  {
    title: "الفصل الخامس",
    page: 320,
  },
  {
    title: "الفصل السادس",
    page: 340,
  },
  {
    title: "الفصل السابع",
    page: 360,
  },
  {
    title: "الفصل الثامن",
    page: 380,
  },
];

export default async function ContentTab({ bookId }: { bookId: string }) {
  let result: Awaited<ReturnType<typeof fetchBook>>;

  try {
    result = await fetchBook(bookId);
  } catch (e) {
    notFound();
  }

  const book = result.book;
  const author = book.author;

  return (
    <>
      <SidebarContainer>
        <nav className="flex" aria-label="Breadcrumb" dir="rtl">
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
        </nav>

        <h2 className="mt-6 flex gap-2 text-4xl font-bold">
          {book.primaryArabicName}
        </h2>

        <div className="mt-6 flex items-center">
          <HoverCard>
            <HoverCardTrigger asChild>
              <p className="text-sm text-gray-700">
                {author.primaryArabicName}
              </p>
            </HoverCardTrigger>

            <HoverCardContent>
              <p className="text-sm text-gray-500">
                {author.otherArabicNames.join(", ")}
              </p>
              <p className="mt-5 text-sm text-gray-500">
                {author.otherLatinNames.join(", ")}
              </p>

              {/* <p>{author.date} AH</p>
                    <p>{author.books.length} Books</p> */}
            </HoverCardContent>
          </HoverCard>

          <span className="mx-3 text-gray-400">•</span>

          <p className="text-sm text-gray-700" dir="ltr">
            {author.year} AH
          </p>

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

                <div className="mt-3 space-y-3 text-sm text-gray-600">
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
                  {book.genreTags.map((tag) => (
                    <Badge
                      key={tag}
                      shape="pill"
                      variant="secondary"
                      className="font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarContainer>

      <Separator className="my-4" />

      <SidebarContainer>
        <div className="flex justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 font-normal text-primary hover:text-primary"
              >
                Page Navigator
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 max-w-full py-5">
              <h4 className="font-medium leading-none">Jump to page</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter a page number between 228 - 380
              </p>

              <div className="mt-4 grid gap-2">
                <div className="grid grid-cols-3 items-center gap-2">
                  <Input
                    id="pageNumber"
                    type="number"
                    placeholder="Page number"
                    className="col-span-2 h-8"
                  />
                  <Button>Go</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="mt-3 flex w-full flex-col gap-3">
          {fakeChapters.map((chapter, idx) => (
            <Button
              key={idx}
              variant="link"
              className={cn(
                "w-full justify-between gap-3 px-0 text-lg font-normal hover:no-underline",
                idx !== 0 && "text-black hover:text-gray-600",
              )}
            >
              {chapter.title}

              <span className="text-xs">{chapter.page}</span>
            </Button>
          ))}
        </div>
      </SidebarContainer>

      <div className="h-16" />
    </>
  );
}
