import { navigation } from "@/lib/urls";
import {
  DocumentMagnifyingGlassIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";

export const tabs = [
  {
    id: "ai",
    label: "common.ai",
    icon: SparklesIcon,
    href: navigation.books.aiTab,
  },
  {
    id: "search",
    label: "common.search",
    icon: DocumentMagnifyingGlassIcon,
    href: navigation.books.searchTab,
  },
  {
    id: "content",
    label: "reader.content",
    icon: ListBulletIcon,
    href: navigation.books.reader,
  },
] satisfies {
  label: string;
  id: string;
  icon: any;
  href: (bookId: string) => string;
}[];
