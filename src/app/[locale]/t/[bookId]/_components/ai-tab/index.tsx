"use client";

import { useCallback, useEffect, useState } from "react";
import { OpenAILogo } from "@/components/Icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { HistoryIcon, InfoIcon, SquarePenIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useBookDetails } from "../../_contexts/book-details.context";
import SidebarContainer from "../sidebar/sidebar-container";
import { usePageNavigation } from "../usePageNavigation";
import { VersionAlert } from "../version-alert";
import ChatForm from "./ChatForm";
import { ChatHistory } from "./ChatHistory";
import ChatMessage from "./ChatMessage";
import useChat from "./useChat";
import { useScrollAnchor } from "./useScrollAnchor";

export default function AITab() {
  const { bookResponse } = useBookDetails();
  const { getVirtuosoScrollProps } = usePageNavigation();
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
  } = useChat({
    bookId: bookResponse.book.id,
    versionId: bookResponse.content.id,
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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
              "flex flex-col justify-between",
              isVersionMismatch
                ? "h-[calc(100svh-220px)] lg:h-[calc(100vh-370px)]"
                : "h-[calc(100svh-110px)] lg:h-[calc(100vh-240px)]",
            )}
          >
            <div className="relative flex-1 overflow-hidden">
              {!isAtBottom && (
                <div className="absolute right-1/2 bottom-0 left-1/2 -translate-x-1/2">
                  <Button
                    size="icon"
                    className="size-8 rounded-full"
                    onClick={scrollToBottom}
                  >
                    <ArrowDownIcon className="size-4" />
                  </Button>
                </div>
              )}

              <div
                className="h-full w-full overflow-y-auto px-6"
                ref={scrollRef}
              >
                <div
                  ref={messagesRef}
                  className="flex flex-col gap-5 pt-4 pb-[30px]"
                >
                  {messages.length === 0 && (
                    <div className="mx-auto flex h-[50vh] max-w-[350px] flex-col items-center justify-center px-8 text-center">
                      <div className="bg-secondary flex size-12 items-center justify-center rounded-full">
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
                              href={`mailto:${SITE_CONFIG.contactEmail}`}
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
        </>
      )}
    </div>
  );
}
