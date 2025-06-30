import type { UseChatHelpers } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { memo, useCallback } from "react";
import { OpenAILogo } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { useScrollAnchor } from "@/hooks/use-scroll-anchor";
import { SITE_CONFIG } from "@/lib/seo";
import equal from "fast-deep-equal";
import { ArrowDownIcon, InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import ChatMessage, { LoadingMessage } from "./chat-message";

function PureMessages({
  messages,
  setMessages,
  reload,
  status,
}: {
  messages: UIMessage[];
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
  status: UseChatHelpers["status"];
}) {
  const t = useTranslations();
  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  const regenerateResponse = useCallback(
    async (messageIndex: number) => {
      const messagesToRegenerate = messages.slice(0, messageIndex);

      setMessages(messagesToRegenerate);
      await reload();
    },
    [reload, setMessages, messages],
  );

  return (
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

      <div className="h-full w-full overflow-y-auto px-6" ref={scrollRef}>
        <div ref={messagesRef} className="flex flex-col gap-5 pt-4 pb-[30px]">
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
              message={message}
              isLoading={status === "streaming" && messages.length - 1 === idx}
              reload={() => regenerateResponse(idx)}
            />
          ))}

          {status === "submitted" &&
            messages.length > 0 &&
            messages[messages.length - 1]!.role === "user" && (
              <LoadingMessage />
            )}

          {status === "error" && (
            <div
              className="flex items-start gap-2 rounded-md border border-red-500 bg-red-100 px-4 py-2 text-sm text-red-500"
              role="alert"
            >
              <InfoIcon className="size-4" />
              <p>
                {t.rich("reader.chat.error", {
                  retry: (children) => (
                    <button
                      onClick={() => reload()}
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
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;

  return true;
});
