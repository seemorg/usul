import { chatWithBook, parseSourceNode } from "@/server/services/chat";
import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import type { ChatResponse } from "@/types/chat";
import { useCallback } from "react";
import { useChatStore } from "../../_stores/chat";

type ChatMessage = {
  id?: string;
  text: string;
  role: "ai" | "user";
  sourceNodes?: SemanticSearchBookNode[];
};

interface UseChatResult {
  messages: ChatMessage[];
  question: string;
  setQuestion: (question: string) => void;
  sendQuestion: () => Promise<void>;
  regenerateResponse: (messageIndex?: number) => Promise<void>;
  clearChat: () => void;
  isPending: boolean;
  isError: boolean;
  error?: Error;
}

const handleEventSource = async (
  id: string,
  eventSource: EventSource,
  {
    onChunk,
  }: {
    onChunk?: (chunk: ChatMessage) => void;
  },
) => {
  return new Promise<ChatMessage>((res, rej) => {
    let allContent = "";
    let sources: SemanticSearchBookNode[] = [];

    eventSource.onerror = (err) => {
      eventSource.close();
      rej(err);
    };

    eventSource.onmessage = (event) => {
      if (event.data === "FINISH") {
        eventSource.close();
        return res({
          id,
          role: "ai",
          text: allContent,
          sourceNodes: (sources ?? []).map(parseSourceNode),
        });
      }

      if (!event.data) return;

      const data = JSON.parse(event.data) as ChatResponse;
      if (!data) return;

      if ("type" in data && data.type === "SOURCES") {
        sources = data.sourceNodes;
      }

      if ("response" in data && data.response) {
        allContent += data.response;
      }

      if (onChunk) {
        onChunk({ id, role: "ai", text: allContent });
      }
    };
  });
};

export default function useChat({
  bookSlug,
}: {
  bookSlug: string;
}): UseChatResult {
  const {
    messages,
    setMessages,
    question,
    setQuestion,
    isPending,
    setIsPending,
    error,
    setError,
    reset,
  } = useChatStore();

  const sendQuestion = useCallback(async () => {
    setIsPending(true);

    const q = question.trim();
    const newMessages = [...messages, { role: "user", text: q } as ChatMessage];

    setMessages([...newMessages, { role: "ai", text: "" }]);
    setQuestion("");

    try {
      const { eventSource, messageId } = await chatWithBook({
        bookSlug,
        question: q,
        messages,
      });

      const result = await handleEventSource(messageId, eventSource, {
        onChunk(chunk) {
          setMessages([...newMessages, chunk]);
        },
      });

      setMessages([...newMessages, result]);
    } catch (err) {
      setMessages(newMessages);
      setError(err as Error);
    }

    setIsPending(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookSlug, question]);

  const regenerateResponse = useCallback(
    async (messageIndex?: number) => {
      let previousMessages: ChatMessage[] = [];
      let question: ChatMessage | undefined;
      const newMessages = [...messages];

      if (messageIndex === undefined) {
        // user click on error message
        previousMessages = newMessages.slice(0, newMessages.length - 1);
        question = newMessages.at(-1)!;
        setMessages([...newMessages, { role: "ai", text: "" }]);
      } else {
        const message = newMessages[messageIndex]!;

        if (message.role !== "ai") return;

        // delete this message and all messages after
        newMessages.splice(messageIndex);
        setMessages([...newMessages, { role: "ai", text: "" }]);

        previousMessages = newMessages.slice(0, newMessages.length - 1);
        question = newMessages.at(-1)!;
      }

      setIsPending(true);

      try {
        const { eventSource, messageId } = await chatWithBook({
          bookSlug,
          question: question.text,
          messages: previousMessages,
        });

        const result = await handleEventSource(messageId, eventSource, {
          onChunk(chunk) {
            setMessages([...newMessages, chunk]);
          },
        });
        setMessages([...newMessages, result]);
      } catch (err) {
        setMessages(newMessages);
        setError(err as Error);
      }

      setIsPending(false);
    },
    [bookSlug, messages],
  );

  return {
    isError: !!error,
    error,
    messages,
    question,
    setQuestion,
    clearChat: reset,
    sendQuestion,
    isPending,
    regenerateResponse,
  };
}
