import type { UseGlobalChatReturn } from "@/hooks/use-global-chat";
import type { UIMessage } from "ai";
import { memo } from "react";
import { useMessages } from "@/hooks/use-messages";
import equal from "fast-deep-equal";
import { motion } from "framer-motion";

import { Greeting } from "./greeting";
import { PreviewMessage, ThinkingMessage } from "./message";

interface MessagesProps {
  chatId?: string;
  status: UseGlobalChatReturn["status"];
  isSubmitting?: boolean;
  messages: Array<UIMessage>;
  setMessages: UseGlobalChatReturn["setMessages"];
  reload: UseGlobalChatReturn["reload"];
  isReadonly: boolean;
  isArtifactVisible: boolean;
  updateMessage: UseGlobalChatReturn["updateMessage"];
}

function PureMessages({
  chatId,
  status,
  isSubmitting,
  messages,
  setMessages,
  reload,
  isReadonly,
  updateMessage,
}: MessagesProps) {
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
  } = useMessages({
    chatId,
    status,
  });

  return (
    <div
      ref={messagesContainerRef}
      className="relative flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-10"
    >
      {messages.length === 0 && <Greeting />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          message={message}
          isLoading={status === "streaming" && messages.length - 1 === index}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          requiresScrollPadding={
            hasSentMessage && index === messages.length - 1
          }
          updateMessage={updateMessage}
        />
      ))}

      {(status === "submitted" || isSubmitting) &&
        messages.length > 0 &&
        messages[messages.length - 1]!.role === "user" && <ThinkingMessage />}

      <motion.div
        ref={messagesEndRef}
        className="min-h-[24px] min-w-[24px] shrink-0"
        onViewportLeave={onViewportLeave}
        onViewportEnter={onViewportEnter}
      />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isArtifactVisible && nextProps.isArtifactVisible) return true;

  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;

  return true;
});
