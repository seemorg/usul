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
import { fetchBook } from "@/lib/book";

const ComingSoonAlert = () => (
  <SidebarContainer>
    <Alert dir="ltr" className="bg-transparent font-sans">
      <AlertTitle>Coming soon</AlertTitle>
      <AlertDescription>This feature is not available yet.</AlertDescription>
    </Alert>
  </SidebarContainer>
);

const tabs = [
  {
    id: "notes",
    label: "Notes",
    icon: PencilSquareIcon,
    content: ComingSoonAlert,
  },
  {
    id: "bookmarks",
    label: "Bookmarks",
    icon: StarIcon,
    content: ComingSoonAlert,
  },
  {
    id: "search",
    label: "Search",
    icon: MagnifyingGlassIcon,
    content: ComingSoonAlert,
  },

  {
    id: "content",
    label: "Content",
    icon: ListBulletIcon,
    content: ContentTab,
  },
];

export default function ReaderSidebar({
  data,
}: {
  data: Awaited<ReturnType<typeof fetchBook>>;
}) {
  return (
    <div className="sticky top-0 flex h-screen flex-none flex-col overflow-y-auto bg-slate-50 pt-24 shadow-inner">
      <div className="absolute bottom-0 left-0 top-0 z-0 w-px bg-slate-300" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[50vw] max-w-full" />

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
                  {tab.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </TabsList>
        </SidebarContainer>

        <div className="mt-6" dir="rtl">
          {tabs.map((tab) => (
            <TabsContent value={tab.id} key={tab.id}>
              <tab.content data={data} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
