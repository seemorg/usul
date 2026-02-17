import type { Chat } from "@/app/[locale]/chat/db";
import type { Message } from "@ai-sdk/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useShallow } from "zustand/shallow";

const CHAT_LIMIT_REACHED_CODE = "CHAT_LIMIT_REACHED";

type UseChatCoreProps = {
  initialChat?: Chat;
  initialId?: string;
  shouldRedirect?: boolean;
  onLimitReached?: () => void;
};

export type UseGlobalChatReturn = ReturnType<typeof useGlobalChat>;

export function useGlobalChat({
  initialChat,
  shouldRedirect = false,
  initialId,
  onLimitReached,
}: UseChatCoreProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const pathLocale = usePathLocale();
  const router = useRouter();
  const [shouldSubmit, setShouldSubmit] = useState(false);

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

  const bookIds = useChatFilters(
    useShallow((s) => s.selectedBooks.map((b) => b.id)),
  );
  const authorIds = useChatFilters(
    useShallow((s) => s.selectedAuthors.map((a) => a.id)),
  );
  const advancedGenreIds = useChatFilters(
    useShallow((s) => s.selectedGenres.map((g) => g.id)),
  );
  const body = useMemo(
    () => ({
      bookIds,
      authorIds,
      advancedGenreIds,
    }),
    [bookIds, authorIds, advancedGenreIds],
  );

  const chatFetch = useCallback(
    async (url: string, options: RequestInit) => {
      const res = await fetch(url, options);
      if (res.status === 403) {
        const data = await res.json().catch(() => ({})) as {
          code?: string;
          message?: string;
        };
        if (data?.code === CHAT_LIMIT_REACHED_CODE) {
          onLimitReached?.();
        }
        throw new Error(data?.message ?? "Chat limit reached");
      }
      return res;
    },
    [onLimitReached],
  );

  const {
    messages,
    setMessages,
    input,
    setInput,
    handleSubmit,
    status,
    stop,
    reload: originalReload,
  } = useChat({
    id: effectiveChatId ? `global-chat-${effectiveChatId}` : "global-chat",
    api: `${env.NEXT_PUBLIC_API_BASE_URL}/chat/multi`,
    initialMessages: initialChat?.messages ?? [],
    body,
    fetch: chatFetch,
    experimental_throttle: 100,
    onError: (err) => {
      if (err?.message?.includes("Chat limit reached")) return;
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
    (text: string) => {
      setInput(text);
      setShouldSubmit(true);
    },
    [setInput],
  );

  useEffect(() => {
    if (shouldSubmit) {
      void submit();
      setShouldSubmit(false);
    }
  }, [shouldSubmit, submit]);

  useEffect(() => {
    if (!effectiveChatId) {
      chatRef.current = null;
    }
  }, [effectiveChatId]);

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
