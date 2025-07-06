import type { Chat } from "@/app/[locale]/chat/db";
import type { Message } from "@ai-sdk/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { db } from "@/app/[locale]/chat/db";
import { env } from "@/env";
import { usePathname } from "@/navigation";
import { useChatFilters } from "@/stores/chat-filters";
import { useChat } from "@ai-sdk/react";
import { add } from "dexie";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type UseChatCoreProps = {
  initialChat?: Chat;
};

export function useGlobalChat({ initialChat }: UseChatCoreProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const chatId = useMemo(() => {
    if (pathname.startsWith("/chat/")) return pathname.split("/chat/")[1];
    return null;
  }, [pathname]);

  const prevChatIdRef = useRef<string | null>(null);
  const chatRef = useRef<Chat | null>(initialChat ?? null);

  const handleFinish = useCallback((message: Message) => {
    if (!chatRef.current) return;
    void db.chats.update(chatRef.current.id, {
      messages: add([message]),
    });
  }, []);

  const ensureChatExists = useCallback(async (input: string) => {
    if (chatRef.current) return chatRef.current.id;

    const newId = uuidv4();
    const newChat: Chat = {
      id: newId,
      title: input,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    window.history.pushState(null, "", `/chat/${newId}`);
    chatRef.current = newChat;

    await db.chats.add(newChat);

    return newId;
  }, []);

  const selectedBooks = useChatFilters((s) => s.selectedBooks);
  const {
    messages,
    setMessages,
    input,
    setInput,
    handleSubmit,
    status,
    stop,
    reload,
  } = useChat({
    api: `${env.NEXT_PUBLIC_API_BASE_URL}/chat/multi`,
    initialMessages: initialChat?.messages ?? [],
    body: {
      bookIds: selectedBooks.map((book) => book.id),
    },
    experimental_throttle: 100,
    onError: () => {
      const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
      toast.error(
        isOffline
          ? "You are offline. Please check your internet connection."
          : "An error occurred!",
      );
    },
    onFinish: handleFinish,
  });

  useEffect(() => {
    // Reset messages when navigating from a chat to home
    if (
      prevChatIdRef.current !== null &&
      chatId === null &&
      messages.length > 0
    ) {
      setMessages([]);
    }
    prevChatIdRef.current = chatId ?? null;
  }, [chatId, messages, setMessages]);

  const submitText = useCallback(
    async (text?: string) => {
      setIsSubmitting(true);

      const textToSend = text ?? input;
      const newMessage: Message = {
        id: uuidv4(),
        content: textToSend,
        role: "user" as const,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      const currentChatId = await ensureChatExists(textToSend);
      handleFinish(newMessage);

      handleSubmit(undefined, {
        body: {
          chatId: currentChatId,
        },
      });

      setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
      setIsSubmitting(false);
    },
    [
      ensureChatExists,
      setIsSubmitting,
      input,
      handleFinish,
      setMessages,
      setInput,
      handleSubmit,
    ],
  );

  const submit = useCallback(() => {
    void submitText();
  }, [submitText]);

  const append = useCallback(
    (text?: string) => {
      void submitText(text);
    },
    [submitText],
  );

  return {
    messages,
    setMessages,
    input,
    setInput,
    submit,
    append,
    status,
    stop,
    reload,
    isSubmitting,
  };
}
