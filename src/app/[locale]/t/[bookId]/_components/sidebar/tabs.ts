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
  isSinglePage?: boolean;
};

export const tabs = [
  {
    id: "content",
    label: "reader.content",
    icon: ListBulletIcon,
  },
  {
    id: "search",
    label: "common.search",
    icon: MagnifyingGlassIcon,
  },
  {
    id: "ai",
    label: "reader.ask-ai",
    icon: SparklesIcon,
  },
] satisfies {
  id: "ai" | "search" | "content";
  label: string;
  icon: any;
}[];
