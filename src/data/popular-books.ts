import { db } from "@/server/db";

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

export const fetchPopularBooks = async () => {
  return db.book.findMany({
    where: {
      slug: {
        in: popularBooks.map(({ slug }) => slug),
      },
    },
  });
};

export const fetchPopularIslamicLawBooks = async () => {
  return db.book.findMany({
    where: {
      slug: {
        in: popularIslamicLawBooks.map(({ slug }) => slug),
      },
    },
  });
};
