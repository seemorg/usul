import type { ApiBookResponse } from "@/types/ApiBookResponse";

import {
  MagnifyingGlassIcon,
  ListBulletIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export type TabProps = {
  bookResponse: ApiBookResponse;
  bookSlug: string;
  versionId?: string;
};

export const tabs = [
  {
    id: "ai",
    label: "reader.ask-ai",
    icon: SparklesIcon,
  },
  {
    id: "search",
    label: "common.search",
    icon: MagnifyingGlassIcon,
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
