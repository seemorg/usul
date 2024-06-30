import { GradientSparklesIcon } from "@/components/Icons";

import {
  DocumentMagnifyingGlassIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

export const tabs = [
  {
    id: "ai",
    label: "common.ai",
    icon: GradientSparklesIcon,
  },
  {
    id: "search",
    label: "common.search",
    icon: DocumentMagnifyingGlassIcon,
  },
  {
    id: "content",
    label: "reader.content",
    icon: ListBulletIcon,
  },
] satisfies {
  id: "ai" | "search" | "content";
  label: string;
  icon: any;
}[];
