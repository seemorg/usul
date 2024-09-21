import type { CollectionCardProps } from "@/components/ui/collection-card";
import type { NamespaceTranslations } from "@/types/NamespaceTranslations";

export const collections: {
  name: NamespaceTranslations<"home.collections">;
  genre: string;
  numberOfBooks: number;
  color: CollectionCardProps["color"];
  pattern: CollectionCardProps["pattern"];
}[] = [
  {
    name: "quranic-sciences",
    genre: "quran-sciences",

    color: "gray",
    pattern: 1,
    numberOfBooks: 10,
  },
  {
    name: "hadith-sciences",
    genre: "hadith-sciences",
    color: "red",
    pattern: 2,
    numberOfBooks: 10,
  },
  {
    name: "fiqh",
    genre: "fiqh",
    color: "green",
    pattern: 3,
    numberOfBooks: 10,
  },
  {
    name: "islamic-theology",
    genre: "theology",
    color: "yellow",
    pattern: 4,
    numberOfBooks: 10,
  },
  {
    name: "islamic-history",
    genre: "sira",
    color: "indigo",
    pattern: 5,
    numberOfBooks: 10,
  },
  {
    name: "islamic-ethics",
    genre: "akhlaq",
    color: "indigo",
    pattern: 6,
    numberOfBooks: 10,
  },
  {
    name: "islamic-philosophy",
    genre: "philosophy",
    color: "green",
    pattern: 7,
    numberOfBooks: 10,
  },
  {
    name: "islamic-finance",
    genre: "finance",
    color: "green",
    pattern: 8,
    numberOfBooks: 10,
  },
  {
    name: "literature",
    genre: "nahw",
    color: "gray",
    pattern: 9,
    numberOfBooks: 10,
  },
  {
    name: "medicine",
    genre: "medicine",
    color: "yellow",
    pattern: 10,
    numberOfBooks: 10,
  },
];
