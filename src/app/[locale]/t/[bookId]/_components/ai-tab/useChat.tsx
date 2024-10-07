import { chatWithBook, parseSourceNode } from "@/server/services/chat";
import type { ChatResponse } from "@/types/chat";
import { useCallback, useState } from "react";
import { useBoolean } from "usehooks-ts";

type ChatMessage = {
  role: "ai" | "user";
  text: string;
  sourceNodes?: ChatResponse["sourceNodes"];
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
  eventSource: EventSource,
  {
    onChunk,
  }: {
    onChunk?: (chunk: ChatMessage) => void;
  },
) => {
  return new Promise<ChatMessage>((res, rej) => {
    let allContent = "";
    let sources: ChatResponse["sourceNodes"] = [];

    eventSource.onerror = (err) => {
      eventSource.close();
      rej(err);
    };

    eventSource.onmessage = (event) => {
      if (event.data === "FINISH") {
        eventSource.close();
        return res({
          role: "ai",
          text: allContent,
          sourceNodes: (sources ?? []).map(parseSourceNode),
        });
      }

      if (!event.data) return;

      const data = JSON.parse(event.data) as ChatResponse;
      if (!data) return;

      allContent += data.response;
      sources = data.sourceNodes;

      if (onChunk) {
        onChunk({ role: "ai", text: allContent });
      }
    };
  });
};

export default function useChat({
  bookSlug,
}: {
  bookSlug: string;
}): UseChatResult {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const isPending = useBoolean(false);

  const sendQuestion = useCallback(async () => {
    isPending.setTrue();

    const q = question.trim();
    const newMessages = [...messages, { role: "user", text: q } as ChatMessage];

    setMessages([...newMessages, { role: "ai", text: "" }]);
    setQuestion("");

    try {
      const eventSource = await chatWithBook({
        bookSlug,
        question: q,
        messages,
      });

      const result = await handleEventSource(eventSource, {
        onChunk(chunk) {
          setMessages([...newMessages, chunk]);
        },
      });

      setMessages([...newMessages, result]);
    } catch (err) {
      setMessages(newMessages);
      setError(err as Error);
    }

    isPending.setFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookSlug, question]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(undefined);
    setQuestion("");
    isPending.setFalse();
  }, []);

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

      isPending.setTrue();

      try {
        const eventSource = await chatWithBook({
          bookSlug,
          question: question.text,
          messages: previousMessages,
        });

        const result = await handleEventSource(eventSource, {
          onChunk(chunk) {
            setMessages([...newMessages, chunk]);
          },
        });
        setMessages([...newMessages, result]);
      } catch (err) {
        setMessages(newMessages);
        setError(err as Error);
      }

      isPending.setFalse();
    },
    [bookSlug, messages],
  );

  return {
    isError: !!error,
    error,
    messages,
    question,
    setQuestion,
    clearChat,
    sendQuestion,
    isPending: isPending.value,
    regenerateResponse,
  };
}
