import Navbar from "@/components/navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";

import { AppSidebar } from "./chat-sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();

  return (
    <div className="[--navbar-height:calc(var(--spacing)*16)] lg:[--navbar-height:calc(var(--spacing)*20)]">
      <Navbar />

      <SidebarProvider defaultOpen>
        <AppSidebar />

        <main className="bg-background relative h-[calc(100dvh-var(--navbar-height))] w-full">
          <div className="h-[var(--navbar-height)] w-full" />
          <SidebarTrigger
            className="fixed top-[var(--navbar-height)] z-10 mt-4.5 md:hidden ltr:left-1 rtl:right-1"
            tooltip={t("chat.sidebar.toggle_sidebar")}
            tooltipProps={{
              side: "right",
              align: "center",
              variant: "primary",
              className: "hidden group-data-[collapsible=icon]:block",
            }}
          />

          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
