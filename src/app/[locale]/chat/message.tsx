"use client";

import type { UseGlobalChatReturn } from "@/hooks/use-global-chat";
import type { MessageAnnotation } from "@/types/chat";
import type { UIMessage } from "ai";
import { memo, useState } from "react";
import { Markdown } from "@/components/chat/markdown";
import { MessageActions } from "@/components/chat/message-actions";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import equal from "fast-deep-equal";
import { AnimatePresence, motion } from "framer-motion";
import { PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import Avatar from "./avatar";
import { MessageEditor } from "./message-editor";
import { MessageReasoning } from "./message-reasoning";
import StatusLabel from "./status-label";

function sanitizeText(text: string) {
  return text.replaceAll("<has_function_call>", "");
}

const PurePreviewMessage = ({
  message,
  isLoading,
  setMessages,
  reload,
  isReadonly,
  requiresScrollPadding,
  updateMessage,
}: {
  message: UIMessage;
  isLoading: boolean;
  setMessages: UseGlobalChatReturn["setMessages"];
  reload: UseGlobalChatReturn["reload"];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
  updateMessage: UseGlobalChatReturn["updateMessage"];
}) => {
  const t = useTranslations();
  const [mode, setMode] = useState<"view" | "edit">("view");

  const annotations = (message.annotations ?? []) as MessageAnnotation[];
  const sourceNodes = annotations.find(
    (annotation) => annotation.type === "SOURCES",
  )?.value;
  const chatIdFromAnnotation = annotations.find(
    (annotation) => annotation.type === "CHAT_ID",
  )?.value;

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="group/message mx-auto w-full max-w-3xl px-4"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex w-full gap-4 group-data-[role=user]/message:max-w-2xl ltr:group-data-[role=user]/message:ml-auto rtl:group-data-[role=user]/message:mr-auto",
            mode === "edit" ? "w-full" : "group-data-[role=user]/message:w-fit",
          )}
        >
          {message.role === "assistant" && <Avatar />}

          <div
            className={cn(
              "flex w-full flex-col gap-4",
              requiresScrollPadding && message.role === "assistant"
                ? "min-h-96"
                : "",
            )}
          >
            {message.role === "assistant" && (
              <StatusLabel annotations={annotations} isLoading={isLoading} />
            )}

            {message.parts.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === "reasoning") {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.reasoning}
                  />
                );
              }

              if (type === "text") {
                if (mode === "view") {
                  return (
                    <div key={key} className="flex flex-row items-start gap-2">
                      {message.role === "user" && !isReadonly && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground rounded-full opacity-0 group-hover/message:opacity-100"
                              onClick={() => setMode("edit")}
                            >
                              <PencilIcon className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("chat.messages.edit_tooltip")}
                          </TooltipContent>
                        </Tooltip>
                      )}

                      <bdi
                        data-testid="message-content"
                        className={cn(
                          "flex flex-col gap-4",
                          message.role === "user" &&
                            "bg-muted text-foreground rounded-3xl px-4 py-2 font-medium",
                        )}
                      >
                        <Markdown sourceNodes={sourceNodes}>
                          {sanitizeText(part.text)}
                        </Markdown>
                      </bdi>
                    </div>
                  );
                }

                if (mode === "edit") {
                  return (
                    <div key={key} className="flex flex-row items-start gap-2">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        updateMessage={updateMessage}
                      />
                    </div>
                  );
                }
              }

              // if (type === "tool-invocation") {
              //   const { toolInvocation } = part;
              //   const { toolName, toolCallId, state } = toolInvocation;

              // if (state === "call") {
              //   const { args } = toolInvocation;

              //   return (
              //     <div
              //       key={toolCallId}
              //       className={cn({
              //         skeleton: ["getWeather"].includes(toolName),
              //       })}
              //     >
              //       {toolName === "getWeather" ? (
              //         <Weather />
              //       ) : toolName === "createDocument" ? (
              //         <DocumentPreview isReadonly={isReadonly} args={args} />
              //       ) : toolName === "updateDocument" ? (
              //         <DocumentToolCall
              //           type="update"
              //           args={args}
              //           isReadonly={isReadonly}
              //         />
              //       ) : toolName === "requestSuggestions" ? (
              //         <DocumentToolCall
              //           type="request-suggestions"
              //           args={args}
              //           isReadonly={isReadonly}
              //         />
              //       ) : null}
              //     </div>
              //   );
              // }

              // if (state === "result") {
              //   const { result } = toolInvocation;

              //   return (
              //     <div key={toolCallId}>
              //       {toolName === "getWeather" ? (
              //         <Weather weatherAtLocation={result} />
              //       ) : toolName === "createDocument" ? (
              //         <DocumentPreview
              //           isReadonly={isReadonly}
              //           result={result}
              //         />
              //       ) : toolName === "updateDocument" ? (
              //         <DocumentToolResult
              //           type="update"
              //           result={result}
              //           isReadonly={isReadonly}
              //         />
              //       ) : toolName === "requestSuggestions" ? (
              //         <DocumentToolResult
              //           type="request-suggestions"
              //           result={result}
              //           isReadonly={isReadonly}
              //         />
              //       ) : (
              //         <pre>{JSON.stringify(result, null, 2)}</pre>
              //       )}
              //     </div>
              //   );
              // }
              // }
            })}

            {!isReadonly && !isLoading && chatIdFromAnnotation && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatIdFromAnnotation}
                message={message}
                reload={reload}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
    if (!equal(prevProps.message.annotations, nextProps.message.annotations))
      return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  const t = useTranslations();
  const role = "assistant";

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="group/message mx-auto w-full max-w-3xl px-4"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cn(
          "flex w-full gap-4 rounded-3xl group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2",
          "group-data-[role=user]/message:bg-muted",
        )}
      >
        <Avatar />

        <div className="flex w-full flex-col gap-2">
          <div className="text-muted-foreground flex flex-col gap-4">
            {t("chat.messages.thinking")}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
