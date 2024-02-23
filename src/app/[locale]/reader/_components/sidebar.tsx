import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Container from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchBook } from "@/lib/book";
import { cn } from "@/lib/utils";
import {
  MagnifyingGlassIcon,
  ListBulletIcon,
  ArrowUturnLeftIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
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

const tabs = [
  {
    id: "notes",
    label: "Notes",
    icon: PencilSquareIcon,
  },
  {
    id: "search",
    label: "Search",
    icon: MagnifyingGlassIcon,
  },
  {
    id: "info",
    label: "Info",
    icon: ListBulletIcon,
  },
];

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

export default async function ReaderSidebar() {
  const { book, author } = await fetchBook();

  return (
    <div className="top-0 hidden h-screen w-[21rem] bg-slate-50 font-amiri shadow-inner lg:sticky lg:flex lg:flex-none lg:flex-col lg:pt-20">
      <div className="absolute bottom-0 left-0 top-0 w-px bg-slate-300" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[50vw] max-w-full" />

      <Container className="mx-0 mt-3">
        <Tabs defaultValue="info">
          <TabsList className="h-10 w-full font-sans">
            {tabs.map((tab) => (
              <Tooltip key={tab.id}>
                <TabsTrigger value={tab.id} className="w-full py-1.5" asChild>
                  <TooltipTrigger>
                    <tab.icon className="h-5 w-5" />
                  </TooltipTrigger>
                </TabsTrigger>

                <TooltipContent side="bottom" sideOffset={10}>
                  {tab.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </TabsList>

          <div className="mt-8" dir="rtl">
            <TabsContent value="info">
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
                            "text-sm font-medium text-gray-500 hover:text-gray-700 ltr:ml-2 rtl:mr-2",
                          )}
                        >
                          {b}
                        </a>
                      </div>
                    </li>
                  ))}
                </ol>
              </nav>

              <h2 className="mt-8 flex gap-2 text-3xl font-bold">
                {book.title_ar[0]}

                <Button size="icon" variant="ghost">
                  <ChevronDownIcon className="h-5 w-5" />
                </Button>
              </h2>

              <div className="mt-3 flex items-center">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <p className="text-sm text-gray-700">
                      {author.author_ar[0]}
                    </p>
                  </HoverCardTrigger>

                  <HoverCardContent>
                    <p className="text-sm text-gray-500">
                      {author.author_ar.slice(1).join(", ")}
                    </p>
                    <p className="mt-5 text-sm text-gray-500">
                      {author.author_lat.join(", ")}
                    </p>

                    {/* <p>{author.date} AH</p>
                    <p>{author.books.length} Books</p> */}
                  </HoverCardContent>
                </HoverCard>

                <span className="mx-3 text-gray-400">•</span>

                <p className="text-sm text-gray-700" dir="ltr">
                  {Number(author.date)} AH
                </p>

                <span className="mx-3 text-gray-400">•</span>

                <p className="text-sm text-gray-700" dir="ltr">
                  {book.versions.length} versions
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-3">
                {(book.genre_tags.length > 2
                  ? book.genre_tags.slice(0, 2)
                  : book.genre_tags
                ).map((tag) => (
                  <Badge
                    key={tag}
                    shape="pill"
                    variant="secondary"
                    className="font-normal"
                  >
                    {tag}
                  </Badge>
                ))}

                {book.genre_tags.length > 2 && (
                  <Badge
                    shape="pill"
                    variant="secondary"
                    dir="ltr"
                    className="font-normal"
                  >
                    +{book.genre_tags.length - 2} More
                  </Badge>
                )}
              </div>

              <div className="mt-10 flex justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-primary hover:text-primary"
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
                    variant="ghost"
                    className="w-full justify-between gap-3 text-lg font-normal"
                  >
                    {chapter.title}

                    <Badge
                      className="py-1 text-xs"
                      shape="pill"
                      variant="outline"
                    >
                      {chapter.page}
                    </Badge>
                  </Button>
                ))}
              </div>

              <div className="relative mt-12 h-full w-full overflow-y-auto">
                {/* <div className="w-full h-full overflow-auto"> */}
                <Container className="pb-16">
                  {/* w-64 max-w-full pr-8 2xl:w-72 2xl:pr-16 */}
                </Container>
                {/* </div> */}
              </div>
            </TabsContent>

            <TabsContent value="search">
              <Alert dir="ltr" className="bg-transparent font-sans">
                <AlertTitle>Coming soon</AlertTitle>
                <AlertDescription>
                  This feature is not yet available.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="notes">
              <Alert dir="ltr" className="bg-transparent font-sans">
                <AlertTitle>Coming soon</AlertTitle>
                <AlertDescription>
                  This feature is not yet available.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </div>
        </Tabs>
      </Container>
    </div>
  );
}
