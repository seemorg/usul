import dynamic from "next/dynamic";
import Spinner from "@/components/ui/spinner";
import type { tabs } from "./tabs";

const Placeholder = () => (
  <div className="flex h-[200px] w-full items-center justify-center">
    <Spinner className="size-5" />
  </div>
);

const AITab = dynamic(() => import("../ai-tab"), { loading: Placeholder });
const ContentTab = dynamic(() => import("../content-tab"), {
  loading: Placeholder,
});
const SearchTab = dynamic(() => import("../search-tab"), {
  loading: Placeholder,
});

type TabId = (typeof tabs)[number]["id"];
export const tabIdToComponent: Record<TabId, any> = {
  ai: AITab,
  search: SearchTab,
  content: ContentTab,
};
