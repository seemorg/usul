import type { MessageAnnotation } from "@/types/chat";
import type { UIMessage } from "ai";
import { memo } from "react";
import StatusLabel from "@/app/[locale]/chat/status-label";
import { Markdown } from "@/components/chat/markdown";
import { cn } from "@/lib/utils";
import equal from "fast-deep-equal";

import { LogoIcon } from "../icons/logo";
import { MessageActions } from "./message-actions";

export type ChatMessageProps = {
  message: UIMessage;
  reload: () => Promise<void>;
  isLoading?: boolean;
  isScreenshot?: boolean;
};

const Avatar = () => (
  <div className="flex size-8 shrink-0">
    <LogoIcon className="text-primary size-6 shrink-0" />
  </div>
);

const ChatMessage = ({
  message,
  isLoading = false,
  isScreenshot = false,
  reload,
}: ChatMessageProps) => {
  const typedAnnotations = (message.annotations ?? []) as MessageAnnotation[];

  const chatId = typedAnnotations.find(
    (annotation) => annotation.type === "CHAT_ID",
  )?.value;

  const sources = typedAnnotations.find(
    (annotation) => annotation.type === "SOURCES",
  )?.value;

  return (
    <div
      className={cn(
        "flex",
        message.role === "assistant" ? "justify-start" : "justify-end",
      )}
    >
      <div
        className={cn(
          "chat-message max-w-full text-wrap @sm:max-w-[90%]",
          "text-foreground group",
          message.role === "assistant"
            ? "flex flex-col items-start gap-3 @sm:flex-row"
            : "dark:bg-accent rounded-2xl bg-gray-200 px-4",
          message.role === "user"
            ? isScreenshot
              ? "flex items-center justify-center py-3"
              : "py-2"
            : "",
        )}
      >
        {message.role === "assistant" && <Avatar />}

        <bdi
          className={cn(
            "block text-sm",
            isScreenshot && message.role === "user" ? "-mt-3" : "",
          )}
        >
          {message.role === "assistant" && (
            <>
              <StatusLabel
                isLoading={isLoading}
                annotations={typedAnnotations}
              />

              <div className="h-2 w-full" />
            </>
          )}

          {message.parts.map((part, idx) => {
            const { type } = part;
            const key = `message-${message.id}-part-${idx}`;

            if (type === "text") {
              return (
                <Markdown key={key} sourceNodes={sources}>
                  {part.text}
                </Markdown>
              );
            }

            return null;
          })}

          {message.role === "assistant" && !isLoading && chatId && (
            <MessageActions chatId={chatId} message={message} reload={reload} />
          )}
        </bdi>
      </div>
    </div>
  );
};

export default memo(ChatMessage, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isScreenshot !== nextProps.isScreenshot) return false;
  if (prevProps.message.id !== nextProps.message.id) return false;
  if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
  if (!equal(prevProps.message.annotations, nextProps.message.annotations))
    return false;

  return true;
});

export function LoadingMessage() {
  return (
    <div className="flex justify-start">
      <div className="chat-message text-foreground group flex max-w-full flex-col items-start gap-3 text-sm text-wrap @sm:max-w-[90%] @sm:flex-row">
        <Avatar />
        <StatusLabel isLoading annotations={[]} />
      </div>
    </div>
  );
}
