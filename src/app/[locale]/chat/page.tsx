"use client";

import Navbar from "@/app/_components/navbar";
import { Button } from "@/components/ui/button";
import { useGlobalChat } from "@/hooks/use-global-chat";
import { PlusIcon } from "lucide-react";

import { MultimodalInput } from "./chat-input";
import { Messages } from "./messages";

export default function ChatPage() {
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
  } = useGlobalChat();

  return (
    <div className="h-dvh [--navbar-height:calc(var(--spacing)*16)] lg:[--navbar-height:calc(var(--spacing)*20)]">
      <Navbar />
      <div className="h-[var(--navbar-height)] w-full" />

      <Button
        variant="outline"
        className="fixed top-[calc(var(--navbar-height))] left-4 z-10 mt-4 gap-2"
        onClick={() => {
          stop();
          setMessages([]);
          setInput("");
        }}
      >
        <PlusIcon className="size-4" />
        <span className="hidden md:block">New Chat</span>
      </Button>

      <main className="bg-background flex h-[calc(100dvh-var(--navbar-height))] min-w-0 flex-col">
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
