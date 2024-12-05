"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import useChat from "./useChat";
import ChatMessage from "./ChatMessage";
import { useCallback } from "react";
import { useScrollAnchor } from "./useScrollAnchor";
import { useTranslations } from "next-intl";
import type { TabProps } from "../sidebar/tabs";
import { usePageNavigation } from "../usePageNavigation";
import ChatForm from "./ChatForm";
import { HistoryIcon, InfoIcon, SquarePenIcon } from "lucide-react";
import { config } from "@/lib/seo";
import { VersionAlert } from "../version-alert";
import SidebarContainer from "../sidebar/sidebar-container";
import { Badge } from "@/components/ui/badge";
import { OpenAILogo } from "@/components/Icons";

export default function AITab({ bookSlug, bookResponse }: TabProps) {
  const { getVirtuosoScrollProps } = usePageNavigation(bookResponse);
  const t = useTranslations();
  const {
    messagesRef,
    scrollRef,
    visibilityRef,
    isAtBottom,
    scrollToBottom,
    resetState,
  } = useScrollAnchor();
  const {
    isError,
    isPending,
    question,
    setQuestion,
    sendQuestion,
    messages,
    clearChat,
    regenerateResponse,
  } = useChat({ bookSlug: bookSlug });

  const onSubmit = useCallback(async () => {
    await sendQuestion();
  }, [sendQuestion]);

  const onClearChat = useCallback(() => {
    clearChat();
    resetState();
  }, [clearChat, resetState]);

  // const isLoading = isPending || isSavingImage.value;
  const isLoading = isPending;

  const isVersionMismatch =
    bookResponse.book.aiVersion !== bookResponse.content.versionId;

  return (
    <div className="pb-2">
      {isVersionMismatch && (
        <SidebarContainer className="my-4">
          <VersionAlert
            versionId={bookResponse.book.aiVersion!}
            versions={bookResponse.book.versions}
            feature="ask-ai"
          />
        </SidebarContainer>
      )}

      <div className="flex items-center justify-between px-6">
        <div className="flex gap-2">
          {t("reader.ask-ai")}{" "}
          <Badge variant="tertiary">{t("common.beta")}</Badge>
        </div>
        <div className="flex">
          {/* <Button
            size="icon"
            variant="ghost"
            className="size-9 text-muted-foreground hover:bg-secondary"
            // onClick={handleShareChat}
            disabled={isLoading}
            tooltip={t("reader.history")}
          >
            <HistoryIcon className="size-4" />
          </Button> */}

          <Button
            size="icon"
            variant="ghost"
            className="size-9 text-muted-foreground hover:bg-secondary"
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
          "will flex flex-col justify-between",
          isVersionMismatch
            ? "h-[calc(100vh-330px)] md:h-[calc(100vh-370px)]"
            : "h-[calc(100vh-200px)] md:h-[calc(100vh-240px)]",
        )}
      >
        <div className="relative flex-1 overflow-hidden">
          {!isAtBottom && (
            <div className="absolute bottom-0 left-1/2 right-1/2 -translate-x-1/2">
              <Button
                size="icon"
                className="size-8 rounded-full"
                onClick={scrollToBottom}
              >
                <ArrowDownIcon className="size-4" />
              </Button>
            </div>
          )}

          <div className="h-full w-full overflow-y-auto px-6" ref={scrollRef}>
            <div
              ref={messagesRef}
              className="flex flex-col gap-5 pb-[30px] pt-4"
            >
              {messages.length === 0 && (
                <div className="mx-auto flex h-[50vh] max-w-[350px] flex-col items-center justify-center px-8 text-center md:h-[65vh]">
                  <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
                    <OpenAILogo className="h-auto w-7" />
                  </div>

                  <p className="mt-4">{t("reader.chat.empty-state")}</p>
                </div>
              )}

              {messages.map((message, idx) => (
                <ChatMessage
                  key={idx}
                  id={message.id}
                  role={message.role}
                  text={message.text}
                  sourceNodes={message.sourceNodes}
                  isLast={idx === messages.length - 1}
                  hasActions={
                    idx === messages.length - 1 && isPending ? false : true
                  }
                  onRegenerate={() => regenerateResponse(idx)}
                  getVirtuosoScrollProps={getVirtuosoScrollProps}
                />
              ))}

              {isError && (
                <div
                  className="flex items-start gap-2 rounded-md border border-red-500 bg-red-100 px-4 py-2 text-sm text-red-500"
                  role="alert"
                >
                  <InfoIcon className="size-4" />
                  <p>
                    {t.rich("reader.chat.error", {
                      retry: (children) => (
                        <button
                          onClick={() => regenerateResponse()}
                          className="inline underline"
                        >
                          {children}
                        </button>
                      ),
                      contact: (children) => (
                        <a
                          href={`mailto:${config.contactEmail}`}
                          target="_blank"
                          className="inline underline"
                        >
                          {children}
                        </a>
                      ),
                    })}
                  </p>
                </div>
              )}

              <div className="h-px w-full" ref={visibilityRef} />
            </div>
          </div>
        </div>

        <ChatForm
          input={question}
          setInput={setQuestion}
          onSubmit={onSubmit}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
