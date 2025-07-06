import type { Chat } from "@/app/[locale]/chat/db";
import type { Message } from "@ai-sdk/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { db } from "@/app/[locale]/chat/db";
import { env } from "@/env";
import { usePathLocale } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { usePathname, useRouter } from "@/navigation";
import { useChatFilters } from "@/stores/chat-filters";
import { useChat } from "@ai-sdk/react";
import { add } from "dexie";
import { nanoid } from "nanoid";
import { toast } from "sonner";

type UseChatCoreProps = {
  initialChat?: Chat;
  initialId?: string;
  shouldRedirect?: boolean;
};

export type UseGlobalChatReturn = ReturnType<typeof useGlobalChat>;

export function useGlobalChat({
  initialChat,
  shouldRedirect = false,
  initialId,
}: UseChatCoreProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const pathLocale = usePathLocale();
  const router = useRouter();

  const chatId = useMemo(() => {
    if (pathname.startsWith(`${navigation.chat.all()}/`))
      return pathname.split(`${navigation.chat.all()}/`)[1];
    return null;
  }, [pathname]);

  const effectiveChatId = chatId || initialId;
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

  const ensureChatExists = useCallback(
    async (input: string) => {
      if (chatRef.current) return chatRef.current.id;

      const newId = initialId ?? nanoid();

      const newChat: Chat = {
        id: newId,
        title: input,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      chatRef.current = newChat;
      await db.chats.add(newChat);

      if (shouldRedirect) {
        router.push(navigation.chat.byId(newId));
      } else {
        window.history.pushState(
          null,
          "",
          `${pathLocale === "en" ? "" : `/${pathLocale}`}${navigation.chat.byId(
            newId,
          )}`,
        );
      }

      return newId;
    },
    [shouldRedirect, router, pathLocale, initialId],
  );

  const selectedBooks = useChatFilters((s) => s.selectedBooks);
  const selectedAuthors = useChatFilters((s) => s.selectedAuthors);
  const selectedGenres = useChatFilters((s) => s.selectedGenres);
  const body = useMemo(() => {
    return {
      bookIds: selectedBooks.map((b) => b.id),
      authorIds: selectedAuthors.map((a) => a.id),
      genreIds: selectedGenres.map((g) => g.id),
    };
  }, [selectedBooks, selectedAuthors, selectedGenres]);

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
    id: effectiveChatId ? `global-chat-${effectiveChatId}` : "global-chat",
    api: `${env.NEXT_PUBLIC_API_BASE_URL}/chat/multi`,
    initialMessages: initialChat?.messages ?? [],
    body,
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

  const submit = useCallback(async () => {
    setIsSubmitting(true);

    const newMessage: Message = {
      id: nanoid(),
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
        id: nanoid(),
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
