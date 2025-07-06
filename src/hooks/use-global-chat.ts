import type { Chat } from "@/app/[locale]/chat/db";
import type { Message } from "@ai-sdk/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { db } from "@/app/[locale]/chat/db";
import { env } from "@/env";
import { usePathLocale } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { usePathname } from "@/navigation";
import { useChatFilters } from "@/stores/chat-filters";
import { useChat } from "@ai-sdk/react";
import { add } from "dexie";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type UseChatCoreProps = {
  initialChat?: Chat;
};

export type UseGlobalChatReturn = ReturnType<typeof useGlobalChat>;

export function useGlobalChat({ initialChat }: UseChatCoreProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const pathLocale = usePathLocale();

  const chatId = useMemo(() => {
    if (pathname.startsWith(`${navigation.chat.all()}/`))
      return pathname.split(`${navigation.chat.all()}/`)[1];
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

  const persistMessages = useCallback((messages: Message[]) => {
    if (!chatRef.current) return;
    void db.chats.update(chatRef.current.id, {
      messages,
      updatedAt: new Date(),
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
    window.history.pushState(
      null,
      "",
      `${pathLocale === "en" ? "" : `/${pathLocale}`}${navigation.chat.byId(
        newId,
      )}`,
    );
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
    reload: originalReload,
    append: originalAppend,
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

  const updateMessage = useCallback(
    (message: Message, draftContent: string) => {
      const index = messages.findIndex((m) => m.id === message.id);
      if (index === -1) return;

      const updatedMessage = {
        ...message,
        content: draftContent,
        parts: [{ type: "text" as const, text: draftContent }],
      };

      const newMessages = [...messages.slice(0, index), updatedMessage];

      setMessages(newMessages);
      persistMessages(newMessages);

      void originalReload();
    },
    [messages, setMessages, persistMessages, originalReload],
  );

  const reload = useCallback(async () => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;

    const messageIndex = messages.findIndex((m) => m.id === lastMessage.id);
    if (messageIndex !== -1) {
      // Remove all messages from the current message onwards
      const truncatedMessages = messages.slice(0, messageIndex);
      setMessages(truncatedMessages);
      persistMessages(truncatedMessages);
    }

    await originalReload({ body: { isRetry: true } });
  }, [messages, setMessages, persistMessages, originalReload]);

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

  const submit = useCallback(async () => {
    setIsSubmitting(true);

    const newMessage: Message = {
      id: uuidv4(),
      content: input,
      role: "user" as const,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    const currentChatId = await ensureChatExists(input);
    handleFinish(newMessage);

    handleSubmit(undefined, {
      body: {
        chatId: currentChatId,
      },
    });

    setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
    setIsSubmitting(false);
  }, [
    ensureChatExists,
    setIsSubmitting,
    input,
    handleFinish,
    setMessages,
    setInput,
    handleSubmit,
  ]);

  const append = useCallback(
    async (text: string) => {
      setIsSubmitting(true);

      const newMessage: Message = {
        id: uuidv4(),
        content: text,
        role: "user" as const,
        createdAt: new Date(),
      };

      const currentChatId = await ensureChatExists(text);
      handleFinish(newMessage);

      await originalAppend(newMessage, {
        body: {
          chatId: currentChatId,
        },
      });

      setIsSubmitting(false);
    },
    [ensureChatExists, setIsSubmitting, handleFinish, originalAppend],
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
    updateMessage,
  };
}
