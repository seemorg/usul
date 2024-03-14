/* eslint-disable react/no-unescaped-entities */
import Container from "@/components/ui/container";
import Navbar from "../_components/navbar";
import SearchBar from "../_components/navbar/search";
import { Link } from "@/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getPopularBooks } from "@/server/services/books";
import BookSearchResult from "@/components/book-search-result";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Footer from "../_components/footer";
import { collections } from "@/lib/collections";
import Image from "next/image";
import { navigation } from "@/lib/urls";

const searchExamples = [
  "الأشباه والنظائر",
  "Al Risala",
  "Ibn Al-Jawzi",
  "Iraq",
  "Fiqh",
];

export default async function HomePage() {
  const texts = await getPopularBooks();

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

      <Container className="flex flex-col gap-32 bg-background py-32">
        <div>
          <Link href="/collections">
            <h2 className="flex items-center gap-2 text-3xl font-bold">
              Collections <ChevronRightIcon className="h-8 w-8" />
            </h2>
          </Link>

          <ScrollArea className="mt-10 w-full whitespace-nowrap">
            <div className="flex gap-7 pb-10">
              {collections.map((collection) => (
                <Link
                  href={navigation.genres.bySlug(collection.genre)}
                  key={collection.genre}
                  className="flex flex-col"
                >
                  <div className="relative block h-44 w-44 overflow-hidden rounded-md bg-gray-200">
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
          <Link href="/texts">
            <h2 className="flex items-center gap-2 text-3xl font-bold">
              Popular Texts <ChevronRightIcon className="h-8 w-8" />
            </h2>
          </Link>

          <ScrollArea className="mt-10 w-full whitespace-nowrap">
            <div className="flex gap-0 pb-10 sm:gap-7">
              {texts.map((text) => (
                <div key={text.id} className="w-[200px] flex-1">
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
          <Link href="/texts">
            <h2 className="flex items-center gap-2 text-3xl font-bold">
              Islamic Law <ChevronRightIcon className="h-8 w-8" />
            </h2>
          </Link>

          <ScrollArea className="mt-10 w-full whitespace-nowrap">
            <div className="flex gap-0 pb-10 sm:gap-7">
              {texts.map((text) => (
                <div key={text.id} className="w-[200px] flex-1">
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
