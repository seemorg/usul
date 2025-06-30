import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import type { UIMessage } from "ai";
import { memo, useMemo } from "react";
import { Markdown } from "@/components/chat/markdown";
import { OpenAILogo } from "@/components/Icons";
import { ShinyText } from "@/components/shiny-text";
import { cn } from "@/lib/utils";
import equal from "fast-deep-equal";

import { MessageActions } from "./message-actions";

export type ChatMessageProps = {
  message: UIMessage;
  reload: () => Promise<void>;
  isLoading?: boolean;
  isScreenshot?: boolean;
};

const ChatMessage = ({
  message,
  isLoading = false,
  isScreenshot = false,
  reload,
}: ChatMessageProps) => {
  const { sources, chatId } = useMemo(() => {
    const typedAnnotations = (message.annotations ?? []) as (
      | {
          type: "SOURCES";
          value: SemanticSearchBookNode[];
        }
      | {
          type: "CHAT_ID";
          value: string;
        }
    )[];

    const sources = typedAnnotations.find(
      (annotation) => annotation.type === "SOURCES",
    )?.value;
    const chatId = typedAnnotations.find(
      (annotation) => annotation.type === "CHAT_ID",
    )?.value;

    return {
      sources,
      chatId,
    };
  }, [message.annotations]);

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
        {message.role === "assistant" && (
          <div className="dark:bg-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white dark:text-white">
            <OpenAILogo className="size-5 shrink-0" />
          </div>
        )}

        <bdi
          className={cn(
            "block text-sm",
            isScreenshot && message.role === "user" ? "-mt-3" : "",
          )}
        >
          {message.role === "assistant" && (
            <>
              <ShinyText
                className="w-fit font-medium"
                shimmerWidth={40}
                disabled={!isLoading}
              >
                {isLoading ? "Thinking..." : "Done!"}
              </ShinyText>
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
      <div className="chat-message text-foreground group flex max-w-full flex-col items-start gap-3 text-wrap @sm:max-w-[90%] @sm:flex-row">
        <div className="dark:bg-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white dark:text-white">
          <OpenAILogo className="size-5 shrink-0" />
        </div>

        <bdi className="block text-sm">
          <div className="loader" />
        </bdi>
      </div>
    </div>
  );
}
