import type { PathLocale } from "@/lib/locale/utils";
import { db } from "@/server/db";
import { getLocaleWhereClause } from "@/server/db/localization";

export const popularBooks = [
  { slug: "sahih" },
  { slug: "sahih-1" },
  { slug: "sunan-4" },
  { slug: "sunan-3" },
  { slug: "sahih-wa-dacif-sunan-tirmidhi" },
  { slug: "sunan-sughra" },
  { slug: "muwatta" },
  { slug: "riyad-salihin" },
  { slug: "ihya-culum-din" },
  { slug: "tafsir-jalalayn" },
  { slug: "tafsir-quran-6" },
  { slug: "fath-bari" },
];

export const popularIslamicLawBooks = [
  { slug: "muwatta" },
  { slug: "mughni" },
  { slug: "hidaya-fi-sharh-bidaya" },
  { slug: "bidayat-mujtahid" },
  { slug: "umm" },
  { slug: "mukhtasar-4" },
  { slug: "risala" },
  { slug: "mukhtasar-sahih-bukhari" },
  { slug: "mabsut-1" },
  { slug: "radd-muhtar" },
  { slug: "muhalla-bi-athar" },
];

export const popularIslamicHistoryBooks = [
  { slug: "sira-nabawiyya" },
  { slug: "sira" },
  { slug: "zad-macad" },
  { slug: "bidaya-1" },
  { slug: "tarikh-5" },
  { slug: "fadail-sahaba" },
  { slug: "sira-1" },
  { slug: "wafat" },
  { slug: "jawamic-sira" },
  { slug: "qisas-anbiya-1" },
];

const fetchBooksBySlugs = (slugs: string[], locale: PathLocale) => {
  const localeWhere = getLocaleWhereClause(locale);

  return db.book.findMany({
    where: {
      slug: {
        in: slugs,
      },
    },
    include: {
      primaryNameTranslations: localeWhere,
      author: {
        include: {
          primaryNameTranslations: localeWhere,
        },
      },
      genres: {
        include: {
          nameTranslations: localeWhere,
        },
      },
    },
  });
};

export const fetchPopularBooks = async (locale: PathLocale) => {
  return fetchBooksBySlugs(
    popularBooks.map((s) => s.slug),
    locale,
  );
};

export const fetchPopularIslamicLawBooks = async (locale: PathLocale) => {
  return fetchBooksBySlugs(
    popularIslamicLawBooks.map((b) => b.slug),
    locale,
  );
};

export const fetchPopularIslamicHistoryBooks = async (locale: PathLocale) => {
  return fetchBooksBySlugs(
    popularIslamicHistoryBooks.map((b) => b.slug),
    locale,
  );
};
