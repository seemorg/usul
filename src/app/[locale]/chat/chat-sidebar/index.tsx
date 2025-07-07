"use client";

import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useDirection } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { useRouter } from "@/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import {
  MessageCirclePlusIcon,
  PencilLineIcon,
  SearchIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { Chat } from "../db";
import { db } from "../db";
import { SidebarList } from "./sidebar-list";

export function AppSidebar() {
  const t = useTranslations();
  const dir = useDirection();
  const chats = useLiveQuery(
    async () => await db.chats.reverse().sortBy("updatedAt"),
  );
  const hasChats = chats && chats.length > 0;
  const router = useRouter();
  const sidebar = useSidebar();
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

  const handleNewChatClick = useCallback(() => {
    router.push(navigation.chat.all());
    if (sidebar.openMobile && sidebar.isMobile) {
      sidebar.setOpenMobile(false);
    }
  }, [sidebar]);

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      side={dir === "rtl" ? "right" : "left"}
      className="mt-[var(--navbar-height)] border-none"
    >
      <SidebarHeader className="pt-4">
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <div className="flex items-center justify-between">
            <h4 className="text-foreground font-bold group-data-[collapsible=icon]:hidden">
              {t("chat.sidebar.chat_history")}
            </h4>
            <SidebarTrigger
              tooltip={t("chat.sidebar.toggle_sidebar")}
              tooltipProps={{
                side: "right",
                align: "center",
                variant: "primary",
                className: "hidden group-data-[collapsible=icon]:block",
              }}
            />
          </div>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarMenuButton
          asChild
          className="py-5"
          tooltip={{
            children: t("chat.sidebar.new_chat"),
            variant: "primary",
          }}
        >
          <button type="button" onClick={handleNewChatClick}>
            <PencilLineIcon className="size-5" />
            {t("chat.sidebar.new_chat")}
          </button>
        </SidebarMenuButton>
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarContent className="mask-t-from-98% mask-t-to-100% mask-b-from-98% mask-b-to-100%">
        <ScrollArea className="flex h-full [&>div>div]:!block">
          <div>
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
              <div className="flex items-center justify-between">
                <SidebarGroupLabel>{t("chat.sidebar.chats")}</SidebarGroupLabel>
                <Button
                  variant="ghost"
                  className="hover:bg-accent text-muted-foreground size-8"
                  size="icon"
                >
                  <SearchIcon className="size-3" />
                </Button>
              </div>

              <SidebarGroupContent>
                {isLoading ? (
                  <div className="h-full" />
                ) : hasChats ? (
                  <div className="space-y-5">
                    {Object.entries(groupedChats).map(
                      ([date, chatsInGroup]) => (
                        <SidebarList
                          key={date}
                          date={date}
                          items={chatsInGroup}
                        />
                      ),
                    )}
                  </div>
                ) : (
                  <div className="mt-30 flex flex-col items-center justify-center md:mt-50">
                    <MessageCirclePlusIcon className="text-muted-foreground size-8 opacity-60" />
                    <div className="text-muted-foreground mt-2 text-center">
                      <p className="mb-1 text-base font-medium">
                        {t("chat.sidebar.no_chats_yet")}
                      </p>
                      <p className="text-sm opacity-70">
                        {t("chat.sidebar.start_conversation")}
                      </p>
                    </div>
                  </div>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
