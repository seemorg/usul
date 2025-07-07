"use client";

import { useState } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import { Messages } from "@/components/chat/messages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBookChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import { useNavbarStore } from "@/stores/navbar";
import { HistoryIcon, SquarePenIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useBookDetails } from "../../_contexts/book-details.context";
import { useChatStore } from "../../_stores/chat";
import SidebarContainer from "../sidebar/sidebar-container";
import { VersionAlert } from "../version-alert";
import { ChatHistory } from "./chat-history";

export default function AITab() {
  const { bookResponse } = useBookDetails();
  const t = useTranslations();

  const {
    input,
    setInput,
    messages,
    setMessages,
    reload,
    handleSubmit,
    status,
  } = useBookChat(bookResponse.book.id, bookResponse.content.id);

  const clearChat = useChatStore((state) => state.clearChat);
  const showNavbar = useNavbarStore((s) => s.showNavbar);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const onClearChat = () => {
    clearChat();
    setMessages([]);
  };

  // const isLoading = isPending || isSavingImage.value;
  const isPending = status === "submitted";
  const isLoading = isPending;
  const isVersionMismatch =
    bookResponse.book.aiVersion !== bookResponse.content.id;

  return (
    <div className="lg:pb-2">
      {isVersionMismatch && (
        <SidebarContainer className="my-4">
          <VersionAlert
            versionId={bookResponse.book.aiVersion}
            versions={bookResponse.book.versions}
            feature="ask-ai"
          />
        </SidebarContainer>
      )}

      {isHistoryOpen ? (
        <ChatHistory
          onOpenChange={setIsHistoryOpen}
          bookId={bookResponse.book.id}
          versionId={bookResponse.content.id}
          setMessages={setMessages}
        />
      ) : (
        <>
          <div className="flex items-center justify-between px-6">
            <div className="flex gap-2">
              <p className="font-semibold">{t("reader.ask-ai")}</p>
              <Badge variant="tertiary">{t("common.beta")}</Badge>
            </div>
            <div className="flex">
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:bg-secondary size-9"
                onClick={() => setIsHistoryOpen(true)}
                disabled={isLoading}
                tooltip={t("reader.history.title")}
              >
                <HistoryIcon className="size-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:bg-secondary size-9"
                onClick={onClearChat}
                disabled={isLoading}
                tooltip={t("reader.chat.new-chat")}
              >
                <SquarePenIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "flex flex-col justify-between transition-[height] duration-300 will-change-[height]",
              isVersionMismatch
                ? showNavbar
                  ? "[--sub-height:220px] lg:[--sub-height:320px]"
                  : "[--sub-height:220px] lg:[--sub-height:240px]"
                : showNavbar
                  ? "[--sub-height:110px] lg:[--sub-height:220px]"
                  : "[--sub-height:110px] lg:[--sub-height:150px]",
              "h-[calc(100svh-var(--sub-height))] lg:h-[calc(100vh-var(--sub-height))]",
            )}
          >
            <Messages
              messages={messages}
              setMessages={setMessages}
              reload={reload}
              status={status}
            />

            <ChatInput
              input={input}
              setInput={setInput}
              onSubmit={handleSubmit}
              status={status}
            />
          </div>
        </>
      )}
    </div>
  );
}
