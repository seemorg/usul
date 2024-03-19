import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  StarIcon,
  MagnifyingGlassIcon,
  ListBulletIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import ContentTab from "./content-tab";
import SidebarContainer from "./sidebar-container";
import SidebarWrapper from "./wrapper";
import type { NamespaceTranslations } from "@/types/NamespaceTranslations";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocaleDirection } from "@/lib/locale";

const ComingSoonAlert = async () => {
  const t = await getTranslations("reader");
  const locale = await getLocale();

  return (
    <SidebarContainer>
      <Alert
        dir={getLocaleDirection(locale as any)}
        className="bg-transparent font-sans"
      >
        <AlertTitle>{t("coming-soon.title")}</AlertTitle>
        <AlertDescription>{t("coming-soon.message")}</AlertDescription>
      </Alert>
    </SidebarContainer>
  );
};

const tabs = [
  {
    id: "notes",
    label: "notes",
    icon: PencilSquareIcon,
    content: ComingSoonAlert,
  },
  {
    id: "bookmarks",
    label: "bookmarks",
    icon: StarIcon,
    content: ComingSoonAlert,
  },
  {
    id: "search",
    label: "search",
    icon: MagnifyingGlassIcon,
    content: ComingSoonAlert,
  },

  {
    id: "content",
    label: "content",
    icon: ListBulletIcon,
    content: ContentTab,
  },
] satisfies {
  label: NamespaceTranslations<"reader">;
  id: string;
  icon: any;
  content: any;
}[];

export default async function ReaderSidebar({ bookId }: { bookId: string }) {
  const t = await getTranslations("reader");

  return (
    <SidebarWrapper>
      <div className="absolute bottom-0 top-0 z-0 w-px bg-border ltr:left-0 rtl:right-0" />
      <div className="pointer-events-none absolute inset-y-0 w-[50vw] max-w-full ltr:left-0 rtl:right-0" />

      <Tabs defaultValue="content">
        <SidebarContainer>
          <TabsList className="h-10 w-full font-sans">
            {tabs.map((tab) => (
              <Tooltip key={tab.id}>
                <TabsTrigger value={tab.id} className="w-full py-1.5" asChild>
                  <TooltipTrigger>
                    <tab.icon className="h-5 w-5" />
                  </TooltipTrigger>
                </TabsTrigger>

                <TooltipContent side="bottom" sideOffset={10}>
                  {t(tab.label)}
                </TooltipContent>
              </Tooltip>
            ))}
          </TabsList>
        </SidebarContainer>

        <div className="mt-6">
          {tabs.map((tab) => (
            <TabsContent value={tab.id} key={tab.id}>
              <tab.content bookId={bookId} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </SidebarWrapper>
  );
}
