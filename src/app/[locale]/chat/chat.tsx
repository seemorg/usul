"use client";

import { useGlobalChat } from "@/hooks/use-global-chat";

import type { Chat } from "./db";
import { MultimodalInput } from "./chat-input";
import ChatFilters from "./filters";
import { Messages } from "./messages";

export default function Chat({ chat }: { chat?: Chat }) {
  const {
    messages,
    setMessages,
    input,
    setInput,
    status,
    stop,
    reload,
    submit,
    append,
    isSubmitting,
  } = useGlobalChat({ initialChat: chat });

  return (
    <main className="flex h-[calc(100dvh-var(--navbar-height))] w-full min-w-0 flex-col">
      <ChatFilters />

      <Messages
        chatId={chat?.id}
        status={status}
        isSubmitting={isSubmitting}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        isReadonly={false}
        isArtifactVisible={false}
      />

      <form className="mx-auto flex w-full flex-col px-4 md:max-w-3xl">
        <MultimodalInput
          input={input}
          setInput={setInput}
          handleSubmit={() => submit()}
          status={status}
          stop={stop}
          messages={messages}
          setMessages={setMessages}
          append={append}
        />

        <p className="text-muted-foreground my-3 text-center text-xs">
          AI can make mistakes. Check important info.
        </p>
      </form>
    </main>
  );
}
