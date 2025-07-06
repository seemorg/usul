"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useLiveQuery } from "dexie-react-hooks";
import { MessageCirclePlusIcon, PencilLineIcon } from "lucide-react";

import type { Chat } from "../db";
import { db } from "../db";
import { SidebarList } from "./sidebar-list";

export function AppSidebar() {
  const chats = useLiveQuery(
    async () => await db.chats.reverse().sortBy("updatedAt"),
  );
  const hasChats = chats && chats.length > 0;
  const router = useRouter();
  const isLoading = !chats;

  const groupedChats = useMemo(() => {
    if (!chats) return {};

    return chats.reduce(
      (groups, item) => {
        const date =
          item.updatedAt instanceof Date
            ? item.updatedAt
            : new Date(item.updatedAt);

        const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        if (!groups[day]) groups[day] = [];
        groups[day].push(item);
        return groups;
      },
      {} as Record<string, Chat[]>,
    );
  }, [chats]);

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="sidebar"
      className="mt-[var(--navbar-height)] border-none"
    >
      <SidebarHeader className="pt-4">
        <SidebarGroup>
          <h4 className="text-foreground font-bold">Chat History</h4>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <ScrollArea>
          <SidebarGroup>
            <SidebarMenuButton asChild className="py-5">
              <button type="button" onClick={() => router.push("/chat")}>
                <PencilLineIcon className="size-5" />
                New Chat
              </button>
            </SidebarMenuButton>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              {isLoading ? (
                <div className="h-full" />
              ) : hasChats ? (
                <div className="space-y-5">
                  {Object.entries(groupedChats).map(([date, chatsInGroup]) => (
                    <SidebarList key={date} date={date} items={chatsInGroup} />
                  ))}
                </div>
              ) : (
                <div className="mt-30 flex flex-col items-center justify-center md:mt-50">
                  <MessageCirclePlusIcon className="text-muted-foreground size-8 opacity-60" />
                  <div className="text-muted-foreground mt-2 text-center">
                    <p className="mb-1 text-base font-medium">No chats yet</p>
                    <p className="text-sm opacity-70">
                      Start a new conversation
                    </p>
                  </div>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
