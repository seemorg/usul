import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  StarIcon,
  DocumentMagnifyingGlassIcon,
  ListBulletIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import ContentTab from "./content-tab";
import SidebarContainer from "./sidebar-container";
import SidebarWrapper from "./wrapper";
import { getTranslations } from "next-intl/server";
import { getLocaleDirection } from "@/lib/locale/utils";
import { getLocale } from "@/lib/locale/server";
import type { ReaderSearchParams } from "@/types/reader-search-params";

const ComingSoonAlert = async () => {
  const t = await getTranslations("reader");
  const locale = await getLocale();

  return (
    <SidebarContainer>
      <Alert
        dir={getLocaleDirection(locale)}
        className="bg-transparent font-sans"
      >
        <AlertTitle>{t("coming-soon.title")}</AlertTitle>
        <AlertDescription>{t("coming-soon.message")}</AlertDescription>
      </Alert>
    </SidebarContainer>
  );
};

export const tabs = [
  {
    id: "notes",
    label: "reader.notes",
    icon: PencilSquareIcon,
    content: ComingSoonAlert,
  },
  {
    id: "bookmarks",
    label: "reader.bookmarks",
    icon: StarIcon,
    content: ComingSoonAlert,
  },
  {
    id: "search",
    label: "common.search",
    icon: DocumentMagnifyingGlassIcon,
    content: ComingSoonAlert,
  },

  {
    id: "content",
    label: "reader.content",
    icon: ListBulletIcon,
    content: ContentTab,
  },
] satisfies {
  label: string;
  id: string;
  icon: any;
  content: any;
}[];

export default async function ReaderSidebar({
  bookId,
  searchParams,
}: {
  bookId: string;
  searchParams: ReaderSearchParams;
}) {
  const t = await getTranslations();

  return (
    <SidebarWrapper>
      <div className="absolute bottom-0 top-0 z-0 w-px bg-border ltr:left-0 rtl:right-0" />
      <div className="pointer-events-none absolute inset-y-0 w-[50vw] max-w-full ltr:left-0 rtl:right-0" />

      <Tabs defaultValue="content">
        <SidebarContainer className="hidden sm:block">
          <TabsList className="h-10 w-full font-sans">
            {tabs.map((tab) => (
              <Tooltip key={tab.id}>
                <TabsTrigger value={tab.id} className="w-full py-1.5" asChild>
                  <TooltipTrigger>
                    <tab.icon className="h-5 w-5" />
                  </TooltipTrigger>
                </TabsTrigger>

                <TooltipContent side="bottom" sideOffset={10}>
                  {t(tab.label as any)}
                </TooltipContent>
              </Tooltip>
            ))}
          </TabsList>
        </SidebarContainer>

        <div className="mt-6">
          {tabs.map((tab) => (
            <TabsContent value={tab.id} key={tab.id}>
              <tab.content bookId={bookId} searchParams={searchParams} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </SidebarWrapper>
  );
}
