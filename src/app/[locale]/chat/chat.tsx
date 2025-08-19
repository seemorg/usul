"use client";

import { useGlobalChat } from "@/hooks/use-global-chat";
import { useTranslations } from "next-intl";

import type { Chat } from "./db";
import { MultimodalInput } from "./chat-input";
import ChatFilters from "./filters";
import { Messages } from "./messages";

export default function Chat({ chat }: { chat?: Chat }) {
  const t = useTranslations();
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
    updateMessage,
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
        updateMessage={updateMessage}
      />

      <form className="mx-auto flex w-full flex-col px-4 md:max-w-3xl">
        <MultimodalInput
          className="rounded-b-none border-b-0 md:rounded-b-3xl md:border"
          input={input}
          setInput={setInput}
          handleSubmit={submit}
          status={status}
          stop={stop}
          messages={messages}
          setMessages={setMessages}
          append={append}
        />

        <p className="text-muted-foreground my-3 hidden text-center text-xs md:block">
          {t("chat.messages.ai_disclaimer")}
        </p>
      </form>
    </main>
  );
}
