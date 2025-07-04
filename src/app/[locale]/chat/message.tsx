"use client";

import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { memo, useState } from "react";
import { Markdown } from "@/components/chat/markdown";
import { MessageActions } from "@/components/chat/message-actions";
import { OpenAILogo } from "@/components/Icons";
import { ShinyText } from "@/components/shiny-text";
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

import { MessageEditor } from "./message-editor";
import { MessageReasoning } from "./message-reasoning";

type MessageAnnotation =
  | {
      type: "SOURCES";
      value: (SemanticSearchBookNode & {
        book: { slug: string; primaryName: string };
      })[];
    }
  | {
      type: "CHAT_ID";
      value: string;
    };

function sanitizeText(text: string) {
  return text.replaceAll("<has_function_call>", "");
}

const Avatar = () => (
  <div className="flex size-8 shrink-0 items-center justify-center">
    <svg
      className="text-primary size-6"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9999 15.9403C11.9999 15.9403 9.98463 17.9428 9.76488 18.1641V20.4253C9.76488 20.4816 9.78738 20.5341 9.83238 20.5678L11.8799 22.2666C11.9493 22.3266 12.0505 22.3266 12.1199 22.2666L14.1674 20.5678C14.2124 20.5341 14.2349 20.4816 14.2349 20.4253V18.1641C14.0163 17.9447 11.9999 15.9403 11.9999 15.9403ZM11.9999 8.05784C11.9999 8.05784 14.0151 6.05496 14.2349 5.83409V3.43034C14.2349 3.37409 14.2086 3.31784 14.1599 3.28034L12.1124 1.72409C12.0797 1.70031 12.0403 1.6875 11.9999 1.6875C11.9595 1.6875 11.9201 1.70031 11.8874 1.72409L9.83988 3.28034C9.79113 3.31784 9.76488 3.37409 9.76488 3.43034V5.83409C9.98351 6.05346 11.9999 8.05784 11.9999 8.05784ZM8.03988 11.9991C8.03988 11.9991 6.03063 9.99284 5.80488 9.77534H3.53238C3.47613 9.77534 3.42363 9.79784 3.38988 9.83909L1.67988 11.8791C1.62363 11.9466 1.62363 12.0516 1.67988 12.1191L3.38988 14.1591C3.42363 14.2003 3.47613 14.2228 3.53238 14.2228H5.80488C5.80488 14.2228 7.65551 12.3808 8.03988 11.9991ZM22.3236 11.8866L20.7599 9.84659C20.7415 9.82456 20.7186 9.80678 20.6927 9.79448C20.6668 9.78218 20.6386 9.77565 20.6099 9.77534H18.1949C17.9733 9.99359 15.9599 11.9991 15.9599 11.9991C15.9599 11.9991 17.9718 14.0035 18.1949 14.2228H20.6099C20.6661 14.2228 20.7224 14.1966 20.7599 14.1516L22.3236 12.1116C22.3761 12.0441 22.3761 11.9541 22.3236 11.8866ZM6.03738 14.7853L4.43238 16.3828C4.39113 16.4241 4.37238 16.4766 4.37613 16.5328L4.61988 19.1766C4.62738 19.2666 4.69863 19.3378 4.78863 19.3453L7.44363 19.5853C7.49988 19.5891 7.55238 19.5703 7.59363 19.5291L9.20238 17.9278C9.20538 17.6185 9.20238 14.7853 9.20238 14.7853H6.03738ZM17.9624 9.21284L19.6686 7.51409C19.7099 7.47284 19.7286 7.41659 19.7211 7.35659L19.3799 4.81409C19.3686 4.73159 19.3049 4.66409 19.2186 4.65284L16.6649 4.31534C16.6364 4.31129 16.6073 4.31393 16.58 4.32304C16.5526 4.33215 16.5278 4.34749 16.5074 4.36784L14.7974 6.07034C14.7944 6.37896 14.7974 9.21284 14.7974 9.21284H17.9624ZM6.03738 9.21284C6.85001 9.21771 8.37476 9.20909 9.20238 9.21284C9.20238 9.21284 9.20576 6.38159 9.20238 6.07034L7.59363 4.46909C7.57426 4.44932 7.55079 4.43404 7.52487 4.42432C7.49896 4.4146 7.47123 4.41068 7.44363 4.41284L4.78863 4.65284C4.69863 4.66034 4.62738 4.73159 4.61988 4.82159L4.37613 7.46534C4.37238 7.52159 4.39113 7.57409 4.43238 7.61534L6.03738 9.21284ZM17.9624 14.7853C17.1498 14.7801 15.6254 14.7891 14.7974 14.7853C14.803 15.6141 14.7933 17.1152 14.7974 17.9278L16.5074 19.6303C16.5411 19.6678 16.5899 19.6866 16.6386 19.6866C16.6926 19.6885 19.171 19.3446 19.2186 19.3453C19.3049 19.3341 19.3686 19.2666 19.3799 19.1841L19.7211 16.6416C19.7252 16.6131 19.7225 16.584 19.7134 16.5567C19.7043 16.5293 19.689 16.5045 19.6686 16.4841L17.9624 14.7853Z"
        fill="currentColor"
      />
      <path
        d="M17.396 14.2246C17.18 14.0082 15.161 12.0009 15.161 12.0009C15.161 12.0009 17.1796 9.99461 17.396 9.77711C17.0911 9.77411 16.3771 9.77936 16.0648 9.77711H14.2348C14.2291 8.95961 14.2385 7.43561 14.2348 6.63086C13.667 7.19336 12.5803 8.27936 11.9998 8.85461C11.9998 8.85461 9.98227 6.84498 9.76477 6.63086C9.76177 6.93461 9.76477 9.77711 9.76477 9.77711C8.94202 9.78273 7.41352 9.77336 6.60352 9.77711C7.16977 10.3437 8.25839 11.4234 8.83852 12.0009C8.83852 12.0009 6.81727 14.0052 6.60352 14.2246C6.90839 14.2276 9.76477 14.2246 9.76477 14.2246C9.77039 15.0421 9.76102 16.5661 9.76477 17.3709C10.3295 16.805 11.4208 15.7239 11.9998 15.1471C11.9998 15.1471 14.015 17.1597 14.2348 17.3709C14.2378 17.0671 14.2348 14.2246 14.2348 14.2246C14.7729 14.2239 17.396 14.2246 17.396 14.2246Z"
        fill="currentColor"
      />
      <path
        d="M11.9999 15.9403C11.9999 15.9403 9.98463 17.9428 9.76488 18.1641V20.4253C9.76488 20.4816 9.78738 20.5341 9.83238 20.5678L11.8799 22.2666C11.9493 22.3266 12.0505 22.3266 12.1199 22.2666L14.1674 20.5678C14.2124 20.5341 14.2349 20.4816 14.2349 20.4253V18.1641C14.0163 17.9447 11.9999 15.9403 11.9999 15.9403ZM11.9999 8.05784C11.9999 8.05784 14.0151 6.05496 14.2349 5.83409V3.43034C14.2349 3.37409 14.2086 3.31784 14.1599 3.28034L12.1124 1.72409C12.0797 1.70031 12.0403 1.6875 11.9999 1.6875C11.9595 1.6875 11.9201 1.70031 11.8874 1.72409L9.83988 3.28034C9.79113 3.31784 9.76488 3.37409 9.76488 3.43034V5.83409C9.98351 6.05346 11.9999 8.05784 11.9999 8.05784ZM8.03988 11.9991C8.03988 11.9991 6.03063 9.99284 5.80488 9.77534H3.53238C3.47613 9.77534 3.42363 9.79784 3.38988 9.83909L1.67988 11.8791C1.62363 11.9466 1.62363 12.0516 1.67988 12.1191L3.38988 14.1591C3.42363 14.2003 3.47613 14.2228 3.53238 14.2228H5.80488C5.80488 14.2228 7.65551 12.3808 8.03988 11.9991ZM22.3236 11.8866L20.7599 9.84659C20.7415 9.82456 20.7186 9.80678 20.6927 9.79448C20.6668 9.78218 20.6386 9.77565 20.6099 9.77534H18.1949C17.9733 9.99359 15.9599 11.9991 15.9599 11.9991C15.9599 11.9991 17.9718 14.0035 18.1949 14.2228H20.6099C20.6661 14.2228 20.7224 14.1966 20.7599 14.1516L22.3236 12.1116C22.3761 12.0441 22.3761 11.9541 22.3236 11.8866ZM6.03738 14.7853L4.43238 16.3828C4.39113 16.4241 4.37238 16.4766 4.37613 16.5328L4.61988 19.1766C4.62738 19.2666 4.69863 19.3378 4.78863 19.3453L7.44363 19.5853C7.49988 19.5891 7.55238 19.5703 7.59363 19.5291L9.20238 17.9278C9.20538 17.6185 9.20238 14.7853 9.20238 14.7853H6.03738ZM17.9624 9.21284L19.6686 7.51409C19.7099 7.47284 19.7286 7.41659 19.7211 7.35659L19.3799 4.81409C19.3686 4.73159 19.3049 4.66409 19.2186 4.65284L16.6649 4.31534C16.6364 4.31129 16.6073 4.31393 16.58 4.32304C16.5526 4.33215 16.5278 4.34749 16.5074 4.36784L14.7974 6.07034C14.7944 6.37896 14.7974 9.21284 14.7974 9.21284H17.9624ZM6.03738 9.21284C6.85001 9.21771 8.37476 9.20909 9.20238 9.21284C9.20238 9.21284 9.20576 6.38159 9.20238 6.07034L7.59363 4.46909C7.57426 4.44932 7.55079 4.43404 7.52487 4.42432C7.49896 4.4146 7.47123 4.41068 7.44363 4.41284L4.78863 4.65284C4.69863 4.66034 4.62738 4.73159 4.61988 4.82159L4.37613 7.46534C4.37238 7.52159 4.39113 7.57409 4.43238 7.61534L6.03738 9.21284ZM17.9624 14.7853C17.1498 14.7801 15.6254 14.7891 14.7974 14.7853C14.803 15.6141 14.7933 17.1152 14.7974 17.9278L16.5074 19.6303C16.5411 19.6678 16.5899 19.6866 16.6386 19.6866C16.6926 19.6885 19.171 19.3446 19.2186 19.3453C19.3049 19.3341 19.3686 19.2666 19.3799 19.1841L19.7211 16.6416C19.7252 16.6131 19.7225 16.584 19.7134 16.5567C19.7043 16.5293 19.689 16.5045 19.6686 16.4841L17.9624 14.7853Z"
        fill="currentColor"
      />
      <path
        d="M17.396 14.2246C17.18 14.0082 15.161 12.0009 15.161 12.0009C15.161 12.0009 17.1796 9.99461 17.396 9.77711C17.0911 9.77411 16.3771 9.77936 16.0648 9.77711H14.2348C14.2291 8.95961 14.2385 7.43561 14.2348 6.63086C13.667 7.19336 12.5803 8.27936 11.9998 8.85461C11.9998 8.85461 9.98227 6.84498 9.76477 6.63086C9.76177 6.93461 9.76477 9.77711 9.76477 9.77711C8.94202 9.78273 7.41352 9.77336 6.60352 9.77711C7.16977 10.3437 8.25839 11.4234 8.83852 12.0009C8.83852 12.0009 6.81727 14.0052 6.60352 14.2246C6.90839 14.2276 9.76477 14.2246 9.76477 14.2246C9.77039 15.0421 9.76102 16.5661 9.76477 17.3709C10.3295 16.805 11.4208 15.7239 11.9998 15.1471C11.9998 15.1471 14.015 17.1597 14.2348 17.3709C14.2378 17.0671 14.2348 14.2246 14.2348 14.2246C14.7729 14.2239 17.396 14.2246 17.396 14.2246Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

const PurePreviewMessage = ({
  chatId,
  message,
  isLoading,
  setMessages,
  reload,
  isReadonly,
  requiresScrollPadding,
}: {
  chatId: string;
  message: UIMessage;
  isLoading: boolean;
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
}) => {
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
            "flex w-full gap-4 group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
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
              <ShinyText
                className="-mb-2 w-fit font-medium"
                shimmerWidth={40}
                disabled={!isLoading}
              >
                {isLoading ? "Thinking..." : "Done"}
              </ShinyText>
            )}
            {/* <Annotations
              annotations={message.annotations}
              isLoading={isLoading}
            /> */}

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
                          <TooltipContent>Edit message</TooltipContent>
                        </Tooltip>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn(
                          "flex flex-col gap-4",
                          message.role === "user" &&
                            "bg-muted text-foreground rounded-full px-4 py-2 font-medium",
                        )}
                      >
                        <Markdown sourceNodes={sourceNodes}>
                          {sanitizeText(part.text)}
                        </Markdown>
                      </div>
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
                        setMessages={setMessages}
                        reload={reload}
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
                reload={async () => {
                  await reload({ body: { isRetry: true } });
                }}
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
          "flex w-full gap-4 rounded-xl group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:px-3 group-data-[role=user]/message:py-2",
          "group-data-[role=user]/message:bg-muted",
        )}
      >
        <Avatar />

        <div className="flex w-full flex-col gap-2">
          <div className="text-muted-foreground flex flex-col gap-4">
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
