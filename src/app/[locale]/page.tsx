/* eslint-disable react/no-unescaped-entities */
import Container from "@/components/ui/container";
import Navbar from "../_components/navbar";
import SearchBar from "../_components/navbar/search";
import { Link } from "@/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import BookSearchResult from "@/components/book-search-result";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import Footer from "../_components/footer";
import { collections } from "@/data/collections";
import Image from "next/image";
import { navigation } from "@/lib/urls";
import {
  fetchPopularBooks,
  fetchPopularIslamicLawBooks,
} from "@/data/popular-books";
import { Button } from "@/components/ui/button";

const searchExamples = [
  "الأشباه والنظائر",
  "Al Risala",
  "Ibn Al-Jawzi",
  "Iraq",
  "Fiqh",
];

const SectionHeader = ({ title, href }: { title: string; href: string }) => (
  <div className="flex items-center justify-between">
    <Link href={href}>
      <h2 className="group flex items-center gap-1 text-2xl font-semibold transition-colors hover:text-primary">
        {title}{" "}
        <ChevronRightIcon className="mt-[3px] h-6 w-6 text-gray-400 transition group-hover:text-primary" />
      </h2>
    </Link>

    <div className="flex items-center">
      <Button size="icon" variant="ghost" disabled>
        <ChevronLeftIcon className="h-5 w-5" />
      </Button>
      <Button size="icon" variant="ghost">
        <ChevronRightIcon className="h-5 w-5" />
      </Button>
    </div>
  </div>
);

const Nav = () => (
  <>
    {/* <div className="pointer-events-none absolute bottom-[75px] left-0 top-0 z-50 flex w-[40px]  items-center justify-center bg-black/50 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100">
      <ChevronLeftIcon className="h-6 w-6 text-white" />
    </div> */}

    {/* <div className="pointer-events-none absolute bottom-[75px] right-0 top-0 z-50 flex w-[40px]  items-center justify-center bg-black/50 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100">
      <ChevronRightIcon className="h-6 w-6 text-white" />
    </div> */}

    {/* <div className="pointer-events-none absolute bottom-[75px] right-0 top-0 z-50 flex w-[40px]  items-center justify-center bg-white/10 backdrop-blur-md" /> */}
  </>
);

export default async function HomePage() {
  const [popularBooks, popularIslamicLawBooks] = await Promise.all([
    fetchPopularBooks(),
    fetchPopularIslamicLawBooks(),
  ]);

  return (
    <>
      <Navbar isHomepage />

      <div className="flex h-[500px] w-full bg-primary pt-32 text-white">
        <Container className="flex flex-col items-center">
          <h1 className="text-6xl font-bold sm:text-6xl">Digital Seem</h1>

          <p className="mt-5 text-lg text-secondary">
            World's largest Islamic library
          </p>

          <div className="mt-[4.5rem] w-full">
            <div className="mx-auto max-w-[52rem]">
              <SearchBar size="lg" />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span>Try:</span>

              {searchExamples.map((e) => (
                <a
                  key={e}
                  className="font-medium text-primary-foreground underline"
                >
                  {e}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <Container className="flex flex-col gap-12 bg-background py-24">
        <div>
          <SectionHeader title="Collections" href="/collections" />

          <ScrollArea className="group relative mt-10 w-full whitespace-nowrap">
            <Nav />
            <div className="flex gap-5 pb-10">
              {collections.map((collection) => (
                <Link
                  href={navigation.genres.bySlug(collection.genre)}
                  key={collection.genre}
                  className="flex flex-col"
                >
                  <div className="relative block h-[180px] w-[180px] overflow-hidden rounded-md bg-gray-200">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      width={500}
                      height={500}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  <p className="mt-2 text-lg font-medium">{collection.name}</p>
                </Link>
              ))}
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <div>
          <SectionHeader title="Popular texts" href="/texts" />

          <ScrollArea className="relative mt-10 w-full whitespace-nowrap">
            <Nav />

            <div className="flex gap-0 pb-10 sm:gap-5">
              {popularBooks.map((text) => (
                <div key={text.id} className="w-[180px] flex-1">
                  <BookSearchResult
                    result={{ document: text } as any}
                    view="grid"
                  />
                </div>
              ))}
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <div>
          <SectionHeader title="Islamic Law" href="/collections" />

          <ScrollArea className="relative mt-10 w-full whitespace-nowrap">
            <Nav />

            <div className="flex gap-0 pb-10 sm:gap-5">
              {popularIslamicLawBooks.map((text) => (
                <div key={text.id} className="w-[180px] flex-1">
                  <BookSearchResult
                    result={{ document: text } as any}
                    view="grid"
                  />
                </div>
              ))}
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <div>
          <SectionHeader title="Islamic History" href="/collections" />

          <ScrollArea className="relative mt-10 w-full whitespace-nowrap">
            <Nav />

            <div className="flex gap-0 pb-10 sm:gap-5">
              {popularIslamicLawBooks.map((text) => (
                <div key={text.id} className="w-[180px] flex-1">
                  <BookSearchResult
                    result={{ document: text } as any}
                    view="grid"
                  />
                </div>
              ))}
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </Container>

      <Footer />
    </>
  );
}
