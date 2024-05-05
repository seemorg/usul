import type { NamespaceTranslations } from "@/types/NamespaceTranslations";

export const collections: {
  name: NamespaceTranslations<"home.collections">;
  genre: string;
  arabicName: string;
  image: string;
}[] = [
  {
    name: "quranic-sciences",
    genre: "quran-sciences",
    arabicName: "علوم القرآن",
    image: "/qur'anic-sciences.png",
  },
  {
    name: "hadith-sciences",
    genre: "hadith-sciences",
    arabicName: "علوم الحديث",
    image: "/hadith-sciences.png",
  },
  {
    name: "fiqh",
    genre: "fiqh",
    arabicName: "فقه",
    image: "/fiqh.png",
  },
  {
    name: "islamic-theology",
    genre: "theology",
    arabicName: "عقيدة",
    image: "/islamic-theology.png",
  },
  {
    name: "islamic-history",
    genre: "sira",
    arabicName: "سيرة",
    image: "/islamic-history.png",
  },
  {
    name: "islamic-ethics",
    genre: "akhlaq",
    arabicName: "أخلاق",
    image: "/islamic-ethics.png",
  },
  {
    name: "islamic-philosophy",
    genre: "philosophy",
    arabicName: "فلسفة",
    image: "/islamic-philosophy.png",
  },
  {
    name: "islamic-finance",
    genre: "finance",
    arabicName: "اقتصاد",
    image: "/islamic-finance.png",
  },
  {
    name: "literature",
    genre: "nahw",
    arabicName: "نحو",
    image: "/literature.png",
  },
  {
    name: "medicine",
    genre: "medicine",
    arabicName: "طب",
    image: "/medicine.png",
  },
];
