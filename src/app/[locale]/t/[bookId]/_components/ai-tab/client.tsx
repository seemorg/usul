"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import {
  ArrowUpTrayIcon,
  PencilSquareIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import useChat from "./useChat";
import { useNavbarStore } from "@/stores/navbar";
import ChatMessage from "./ChatMessage";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import { useBoolean } from "usehooks-ts";
import { useCallback, useRef } from "react";
import { useScrollAnchor } from "./useScrollAnchor";
import { useTranslations } from "next-intl";

export default function AITab({
  bookId,
  pagesRange,
  pageToIndex,
}: {
  bookId: string;
  versionId?: string;
  pagesRange: { start: number; end: number };
  pageToIndex?: Record<number, number>;
}) {
  const { toast } = useToast();
  const t = useTranslations("reader");
  const showNavbar = useNavbarStore((s) => s.showNavbar);
  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();
  const {
    isPending,
    question,
    setQuestion,
    sendQuestion,
    messages,
    clearChat,
    regenerateResponse,
  } = useChat({ bookSlug: bookId });
  const captureRef = useRef<HTMLDivElement>(null);
  const isSavingImage = useBoolean(false);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await sendQuestion();
    },
    [sendQuestion],
  );

  const handleShareChat = useCallback(async () => {
    isSavingImage.setTrue();

    // const height = captureRef.current!.scrollHeight;
    // captureRef.current!.style.height = `${height}px`;

    captureRef.current!.style.width = "700px";
    captureRef.current!.style.height = "fit-content";

    try {
      const canvas = await html2canvas(captureRef.current!, {
        width: 700,
        windowWidth: 1350,
        backgroundColor: "white",
      });

      const link = document.createElement("a");
      link.download = "chat.png";
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      toast({ description: "Done!" });
    } catch (e) {
      toast({ description: "An error occurred!", variant: "destructive" });
    }

    isSavingImage.setFalse();
    captureRef.current!.style.width = "";
    captureRef.current!.style.height = "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = isPending || isSavingImage.value;

  return (
    <div className="pb-2">
      <div className="flex items-center justify-between px-4">
        Chat
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="size-10 hover:bg-secondary"
            onClick={handleShareChat}
            disabled={isLoading}
            tooltip={t("chat.share-chat")}
          >
            <ArrowUpTrayIcon className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="size-10 hover:bg-secondary"
            onClick={clearChat}
            disabled={isLoading}
            tooltip={t("chat.new-chat")}
          >
            <PencilSquareIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* <div
        className="sr-only pointer-events-none flex flex-col gap-5 overflow-y-scroll px-4 py-10"
        ref={captureRef}
      >
        <ChatMessage
          role="ai"
          text="Hey there, send something to start the chat!"
          hasActions={false}
          isScreenshot
          pagesRange={pagesRange}
          pageToIndex={pageToIndex}
        />

        {messages.map((message, idx) => (
          <ChatMessage
            key={idx}
            role={message.role}
            text={message.text}
            sourceNodes={message.sourceNodes}
            hasActions={false}
            isScreenshot
            pagesRange={pagesRange}
            pageToIndex={pageToIndex}
          />
        ))}
      </div> */}

      <div className="relative">
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

        <div
          className={cn(
            "h-[calc(100vh-320px)] w-full overflow-y-auto px-4",
            showNavbar ? "" : "",
          )}
          ref={scrollRef}
        >
          <div ref={messagesRef} className="flex flex-col gap-5 pb-[50px] pt-4">
            <ChatMessage
              role="ai"
              text="Hey there, send something to start the chat!"
              hasActions={false}
              pagesRange={pagesRange}
              pageToIndex={pageToIndex}
            />

            {messages.map((message, idx) => (
              <ChatMessage
                key={idx}
                role={message.role}
                text={message.text}
                sourceNodes={message.sourceNodes}
                isLast={idx === messages.length - 1}
                hasActions={
                  idx === messages.length - 1 && isPending ? false : true
                }
                onRegenerate={() => regenerateResponse(idx)}
                pagesRange={pagesRange}
                pageToIndex={pageToIndex}
              />
            ))}

            <div className="h-px w-full" ref={visibilityRef} />
          </div>
        </div>
      </div>

      <form
        className={cn(
          "mt-5 flex px-4 transition-transform will-change-transform",
          showNavbar ? "" : "translate-y-16",
        )}
        onSubmit={onSubmit}
      >
        <Input
          className="h-10 flex-1 rounded-r-none bg-white focus-visible:ring-inset dark:bg-accent"
          placeholder="Type your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isPending}
        />

        <Button
          size="icon"
          type="submit"
          className="size-10 shrink-0 rounded-l-none"
          disabled={isPending}
        >
          <ArrowRightIcon className="size-5" />
        </Button>
      </form>
    </div>
  );
}
