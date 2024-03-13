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

export default async function HomePage() {
  const texts = await getPopularBooks();

  return (
    <>
      <Navbar isHomepage />

      <div className="flex h-[500px] w-full items-center justify-center bg-primary pt-16 text-white sm:pt-28">
        <Container className="flex flex-col items-center">
          <h1 className="text-6xl font-bold sm:text-7xl">Digital Seem</h1>

          <p className="mt-5 text-lg text-secondary">
            World's largest Islamic library
          </p>

          <div className="mt-10 w-full">
            <div className="mx-auto max-w-4xl">
              <SearchBar size="lg" />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <span>Try:</span>

              <a className="font-medium text-primary-foreground underline">
                Ibn Al-Jawzi
              </a>
              <a className="font-medium text-primary-foreground underline">
                Ibn Taymiyyah
              </a>
              <a className="font-medium text-primary-foreground underline">
                Al-Ashbah wa al-Naza'ir
              </a>
              <a className="font-medium text-primary-foreground underline">
                Iraq
              </a>
              <a className="font-medium text-primary-foreground underline">
                Fiqh
              </a>
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
              {new Array(10).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <div className="block h-44 w-44 rounded-md bg-gray-200" />

                  <p className="mt-2 text-lg font-medium">Collection Name</p>
                </div>
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
                  <BookSearchResult result={{ document: text } as any} />
                </div>
              ))}
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </Container>

      <Footer />
      {/* <footer className="bg-muted">
        <Container className="py-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium">Digital Seem</p>

              <p className="mt-2 text-sm text-muted-foreground">
                World's largest Islamic library
              </p>
            </div>

            <div>
              <p className="text-lg font-medium">Contact</p>

              <p className="mt-2 text-sm text-muted-foreground">
                <a href="mailto:admin@digitalseem.org">Email</a>
              </p>
            </div>
          </div>
        </Container>
      </footer> */}
    </>
  );
}
