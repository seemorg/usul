"use client";

import Navbar from "@/app/_components/navbar";
import { env } from "@/env";
import { useChat } from "@ai-sdk/react";

import { useChatFilters } from "./chat-filters";
import { MultimodalInput } from "./chat-input";
import { Messages } from "./messages";

export default function ChatPage() {
  const selectedBooks = useChatFilters((s) => s.selectedBooks);
  const {
    messages,
    setMessages,
    input,
    setInput,
    handleSubmit,
    status,
    stop,
    append,
    reload,
    id,
  } = useChat({
    api: `${env.NEXT_PUBLIC_API_BASE_URL}/chat/multi`,
    body: {
      bookIds: selectedBooks.map((book) => book.id),
    },
  });

  return (
    <div className="h-screen [--navbar-height:calc(var(--spacing)*16)] lg:[--navbar-height:calc(var(--spacing)*20)]">
      <Navbar />

      <div className="h-[var(--navbar-height)] w-full" />
      <main className="bg-background flex h-[calc(100vh-var(--navbar-height))] min-w-0 flex-col">
        <Messages
          chatId={id}
          status={status}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={false}
          isArtifactVisible={false}
        />

        <form className="mx-auto flex w-full flex-col gap-4 px-4 pb-4 md:max-w-3xl">
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            status={status}
            stop={stop}
            messages={messages}
            setMessages={setMessages}
            append={append}
          />

          <p className="text-muted-foreground text-center text-sm">
            AI can make mistakes. Check important info.
          </p>
        </form>
      </main>
    </div>
  );
}
