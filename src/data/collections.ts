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
    genre: "quranic-sciences",
    color: "gray",
    pattern: 1,
    numberOfBooks: 299,
  },
  {
    name: "hadith-sciences",
    genre: "ulum-al-hadith",
    color: "red",
    pattern: 2,
    numberOfBooks: 759,
  },
  {
    name: "fiqh",
    genre: "fiqh",
    color: "green",
    pattern: 3,
    numberOfBooks: 865,
  },
  {
    name: "islamic-theology",
    genre: "creeds-and-sects",
    color: "yellow",
    pattern: 4,
    numberOfBooks: 619,
  },
  {
    name: "islamic-history",
    genre: "history",
    color: "indigo",
    pattern: 5,
    numberOfBooks: 515,
  },

  {
    name: "islamic-philosophy",
    genre: "philosophy",
    color: "green",
    pattern: 7,
    numberOfBooks: 40,
  },
  {
    name: "literature",
    genre: "literature",
    color: "gray",
    pattern: 9,
    numberOfBooks: 592,
  },
];
