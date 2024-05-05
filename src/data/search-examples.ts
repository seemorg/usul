import { navigation } from "@/lib/urls";

export const searchExamples = [
  {
    title: "الأشباه والنظائر",
    href: navigation.books.reader("ashbah-1"),
  },
  {
    title: "Al Risala",
    href: navigation.books.reader("risala"),
  },
  {
    title: "Ibn Al-Jawzi",
    href: navigation.authors.bySlug("ibn-jawzi"),
  },
  {
    title: "Iraq",
    href: navigation.regions.bySlug("iraq"),
  },
  {
    title: "Fiqh",
    href: navigation.genres.bySlug("fiqh"),
  },
];
