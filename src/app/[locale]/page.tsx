import type { PathLocale } from "@/lib/locale/utils";
import type { BookDocument } from "@/types/book";
import type { Locale } from "next-intl";
import BookSearchResult from "@/components/book-search-result";
import { CollectionCard } from "@/components/ui/collection-card";
import Container from "@/components/ui/container";
import {
  fetchIndividualCollections,
  fetchSpecialCollections,
} from "@/data/collections";
import {
  fetchPopularBooks,
  fetchPopularIslamicHistoryBooks,
  fetchPopularIslamicLawBooks,
} from "@/data/popular-books";
import { routing } from "@/i18n/config";
import { getHomepageAdvancedGenres, getHomepageGenres } from "@/lib/api/genres";
import { appLocaleToPathLocale } from "@/lib/locale/utils";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import { PlayIcon } from "@heroicons/react/24/solid";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Footer from "../../components/footer";
import HomepageSection from "../../components/homepage-section";
import Navbar from "../../components/navbar";
import { DemoButton } from "./demo-button";
import { HomepageChatInput } from "./home-chat-input";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = await params;
  return getMetadata({ pagePath: "/", locale });
};

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const bookToTypesenseBook = (
  book: Awaited<ReturnType<typeof fetchPopularBooks>>[number],
  pathLocale: PathLocale,
): BookDocument => {
  return {
    type: "book",
    id: book.id,
    slug: book.slug,
    authorId: book.authorId,

    primaryName:
      pathLocale === "en" && book.transliteration
        ? book.transliteration
        : getPrimaryLocalizedText(book.primaryNameTranslations, pathLocale)!,
    secondaryName:
      getSecondaryLocalizedText(book.primaryNameTranslations, pathLocale) ??
      undefined,

    otherNames: getPrimaryLocalizedText(book.otherNameTranslations, pathLocale),
    secondaryOtherNames: getSecondaryLocalizedText(
      book.otherNameTranslations,
      pathLocale,
    ),

    versions: book.versions,
    coverUrl: book.coverImageUrl ?? undefined,
    genreIds: book.genres.map((g) => g.id),
    genres: book.genres.map((g) => ({
      type: "genre",
      id: g.id,
      slug: g.slug,
      primaryName: getPrimaryLocalizedText(g.nameTranslations, pathLocale)!,
      booksCount: g.numberOfBooks,
    })),

    // these are derived from the author
    author: {
      type: "author",
      id: book.authorId,
      slug: book.author.slug,
      year: book.author.year ?? -1,
      primaryName:
        pathLocale === "en" && book.author.transliteration
          ? book.author.transliteration
          : getPrimaryLocalizedText(
              book.author.primaryNameTranslations,
              pathLocale,
            )!,
      secondaryName:
        getSecondaryLocalizedText(
          book.author.primaryNameTranslations,
          pathLocale,
        ) ?? undefined,
      otherNames: getPrimaryLocalizedText(
        book.author.otherNameTranslations,
        pathLocale,
      ),
      secondaryOtherNames: getSecondaryLocalizedText(
        book.author.otherNameTranslations,
        pathLocale,
      ),

      booksCount: book.author.numberOfBooks,
    },

    year: book.author.year ?? -1,
    geographies: [],
    regions: [],
  };
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  const pathLocale = appLocaleToPathLocale(locale);

  const [
    genres,
    popularBooks,
    popularIslamicLawBooks,
    popularIslamicHistoryBooks,
    specialCollections,
    individualCollections,
  ] = await Promise.all([
    getHomepageAdvancedGenres({ locale: pathLocale }),
    fetchPopularBooks(pathLocale),
    fetchPopularIslamicLawBooks(pathLocale),
    fetchPopularIslamicHistoryBooks(pathLocale),
    fetchSpecialCollections(pathLocale),
    fetchIndividualCollections(pathLocale),
  ]);

  const t = await getTranslations({ locale });

  return (
    <>
      <Navbar layout="home" />

      <div className="relative flex min-h-[470px] w-full pt-24 pb-10 text-white sm:pt-28">
        <div className="bg-muted-primary absolute inset-0 z-0 h-full w-full" />
        {/* [clip-path:ellipse(130%_100%_at_50%_0%)] */}

        <Container className="z-1 flex flex-col items-center">
          <h1 className="text-center text-4xl font-bold sm:text-5xl">
            {t("home.headline")}
          </h1>

          <p className="mt-5 text-center text-xl text-white/80">
            {t("home.subheadline")}
          </p>

          <div className="mt-7 flex w-full justify-center">
            <DemoButton>
              <PlayIcon className="size-4" />
              {t("home.how-usul-works")} - 2:00
            </DemoButton>
          </div>

          <div className={cn("w-full", "mt-16 sm:mt-[4.5rem]")}>
            <div className="mx-auto max-w-[46rem]">
              <HomepageChatInput />
              {/* <SearchBar size="lg" /> */}
            </div>
          </div>
        </Container>
      </div>

      <Container className="flex flex-col gap-4 py-10 sm:gap-12 sm:py-12">
        <div>
          <HomepageSection
            isBooks={false}
            title={t("home.sections.collections")}
            href={navigation.collections.all()}
            items={(genres || []).map((genre) => (
              <Link
                key={genre.id}
                href={navigation.genres.bySlug(genre.slug)}
                prefetch
              >
                <CollectionCard
                  title={genre.name}
                  numberOfBooks={genre.numberOfBooks}
                  pattern={genre.pattern}
                  color={genre.color}
                />
              </Link>
            ))}
          />
        </div>

        <div>
          <HomepageSection
            title={t("home.sections.popular-texts")}
            href="/texts"
            constraintWidth
            items={popularBooks.map((text) => (
              <BookSearchResult
                prefetch
                key={text.id}
                result={bookToTypesenseBook(text, pathLocale)}
                view="grid"
              />
            ))}
          />
        </div>

        {/* TODO: add back when collections populated */}
        {/* 
        <div>
          <HomepageSection
            isBooks={false}
            title={t("home.sections.special-collections")}
            href={navigation.collections.all()}
            items={(specialCollections || []).map((collection) => (
              <Link
                key={collection.id}
                href={navigation.collections.static.bySlug(collection.slug)}
                prefetch
              >
                <CollectionCard
                  title={collection.name}
                  pattern={collection.pattern}
                  color={collection.color}
                />
              </Link>
            ))}
          />
        </div>

        <div>
          <HomepageSection
            isBooks={false}
            title={t("home.sections.individual-collections")}
            href={navigation.collections.all()}
            items={(individualCollections || []).map((collection) => (
              <Link
                key={collection.id}
                href={navigation.collections.static.bySlug(collection.slug)}
                prefetch
              >
                <CollectionCard
                  title={collection.name}
                  pattern={collection.pattern}
                  color={collection.color}
                />
              </Link>
            ))}
          />
        </div> */}

        {/* 
        <div>
          <HomepageSection
            title={t("home.sections.islamic-law")}
            constraintWidth
            items={popularIslamicLawBooks.map((text) => (
              <BookSearchResult
                prefetch
                key={text.id}
                result={bookToTypesenseBook(text, pathLocale)}
                view="grid"
              />
            ))}
          />
        </div>

        <div>
          <HomepageSection
            title={t("home.sections.islamic-history")}
            constraintWidth
            items={popularIslamicHistoryBooks.map((text) => (
              <BookSearchResult
                prefetch
                key={text.id}
                result={bookToTypesenseBook(text, pathLocale)}
                view="grid"
              />
            ))}
          />
        </div> 
        */}
      </Container>

      <Footer />
    </>
  );
}
