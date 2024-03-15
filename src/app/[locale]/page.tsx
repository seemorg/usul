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

const Section = ({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <>
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

      <ScrollArea className="relative mt-10 w-full whitespace-nowrap">
        <div className="flex gap-5 pb-10">{children}</div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

export default async function HomePage() {
  const [popularBooks, popularIslamicLawBooks] = await Promise.all([
    fetchPopularBooks(),
    fetchPopularIslamicLawBooks(),
  ]);

  return (
    <>
      <Navbar isHomepage />

      <div className="flex h-[450px] w-full bg-primary pt-28 text-white sm:h-[500px] sm:pt-32">
        <Container className="flex flex-col items-center">
          <h1 className="text-5xl font-bold sm:text-6xl">Digital Seem</h1>

          <p className="mt-5 text-lg text-secondary">
            World's largest Islamic library
          </p>

          <div className="mt-14 w-full sm:mt-[4.5rem]">
            <div className="mx-auto max-w-[52rem]">
              <SearchBar size="lg" />
            </div>

            <div className="mx-auto mt-4 flex max-w-[300px] flex-wrap items-center justify-center gap-2 sm:max-w-full">
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

      <Container className="flex flex-col gap-12 bg-background py-16 sm:py-24">
        <div>
          <Section title="Collections" href="/collections">
            {collections.map((collection) => (
              <Link
                href={navigation.genres.bySlug(collection.genre)}
                key={collection.genre}
                className="flex flex-col"
              >
                <div className="relative block h-[160px] w-[160px] overflow-hidden rounded-md bg-gray-200 sm:h-[180px] sm:w-[180px]">
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
          </Section>
        </div>

        <div>
          <Section title="Popular texts" href="/texts">
            {popularBooks.map((text) => (
              <div key={text.id} className="w-[160px] flex-1 sm:w-[180px]">
                <BookSearchResult
                  result={{ document: text } as any}
                  view="grid"
                />
              </div>
            ))}
          </Section>
        </div>

        <div>
          <Section title="Islamic Law" href="/collections">
            {popularIslamicLawBooks.map((text) => (
              <div key={text.id} className="w-[160px] flex-1 sm:w-[180px]">
                <BookSearchResult
                  result={{ document: text } as any}
                  view="grid"
                />
              </div>
            ))}
          </Section>
        </div>

        <div>
          <Section title="Islamic History" href="/collections">
            {popularIslamicLawBooks.map((text) => (
              <div key={text.id} className="w-[160px] flex-1 sm:w-[180px]">
                <BookSearchResult
                  result={{ document: text } as any}
                  view="grid"
                />
              </div>
            ))}
          </Section>
        </div>
      </Container>

      <Footer />
    </>
  );
}
