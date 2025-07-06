import Navbar from "@/app/_components/navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "./chat-sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="[--navbar-height:calc(var(--spacing)*16)] lg:[--navbar-height:calc(var(--spacing)*20)]">
      <Navbar />

      <SidebarProvider defaultOpen>
        <AppSidebar />
        <main className="bg-background relative h-[calc(100dvh-var(--navbar-height))] w-full">
          <div className="h-[var(--navbar-height)] w-full" />
          <SidebarTrigger className="absolute top-[calc(var(--navbar-height)+1rem)] left-4 z-10" />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
