import { chatWithBook } from "@/server/services/chat";
import type { ChatResponse } from "@/types/chat";
import { useState } from "react";
import { useBoolean } from "usehooks-ts";
import type EventSource from "eventsource";

type ChatMessage = {
  role: "ai" | "user";
  text: string;
  sourceNodes?: ChatResponse["sourceNodes"];
  isLast?: boolean;
};

interface UseChatResult {
  messages: ChatMessage[];
  question: string;
  setQuestion: (question: string) => void;
  sendQuestion: () => Promise<void>;
  regenerateResponse: (messageIndex: number) => Promise<void>;
  clearChat: () => void;
  isPending: boolean;
}

export default function useChat({
  bookSlug,
}: {
  bookSlug: string;
}): UseChatResult {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const isPending = useBoolean(false);

  const handleEventSource = async (
    eventSource: EventSource,
    {
      onChunk,
    }: {
      onChunk?: (chunk: ChatMessage) => void;
    },
  ) => {
    return await new Promise<ChatMessage>((res, rej) => {
      let allContent = "";
      let sources: ChatResponse["sourceNodes"] = [];

      eventSource.onerror = (err) => {
        eventSource.close();
        rej(err);
      };

      eventSource.onmessage = (event) => {
        if (event.data === "FINISH") {
          eventSource.close();
          return res({ role: "ai", text: allContent, sourceNodes: sources });
        }

        if (!event.data) return;

        const data = JSON.parse(event.data) as ChatResponse;
        if (!data) return;

        allContent += data.response;
        sources = data.sourceNodes;

        onChunk?.({ role: "ai", text: allContent });
      };
    });
  };

  const sendQuestion = async () => {
    isPending.setTrue();

    const q = question.trim();
    const newMessages = [...messages, { role: "user", text: q } as ChatMessage];

    setMessages(newMessages);
    setQuestion("");

    const eventSource = await chatWithBook({
      bookSlug,
      question: q,
      messages,
    });

    const final = await handleEventSource(eventSource, {
      onChunk(chunk) {
        setMessages([...newMessages, chunk]);
      },
    });
    setMessages([...newMessages, final]);

    isPending.setFalse();
  };

  const clearChat = () => {
    setMessages([]);
  };

  const regenerateResponse = async (messageIndex: number) => {
    const newMessages = [...messages];
    const message = newMessages[messageIndex]!;

    if (message.role !== "ai") return;

    // delete this message and all messages after
    newMessages.splice(messageIndex);
    setMessages(newMessages);

    const previousMessages = newMessages.slice(0, newMessages.length - 1);
    const question = newMessages.at(-1)!;

    const eventSource = await chatWithBook({
      bookSlug,
      question: question.text,
      messages: previousMessages,
    });

    const final = await handleEventSource(eventSource, {
      onChunk(chunk) {
        setMessages([...newMessages, chunk]);
      },
    });
    setMessages([...newMessages, final]);
  };

  return {
    messages,
    question,
    setQuestion,
    clearChat,
    sendQuestion,
    isPending: isPending.value,
    // isAutoScroll: isAutoScroll.value,
    // containerRef,
    regenerateResponse,
    // lockAutoScroll,
  };
}
