import { chatWithBook } from "@/server/services/chat";
import type { ChatResponse } from "@/types/chat";
import { useRef, useState } from "react";
import { useBoolean } from "usehooks-ts";

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
  isPending: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function useChat({
  bookSlug,
}: {
  bookSlug: string;
}): UseChatResult {
  const [question, setQuestion] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const isPending = useBoolean(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      // Scroll to the bottom
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
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

    await new Promise((res, rej) => {
      let allContent = "";
      let sources: ChatResponse["sourceNodes"] = [];
      let isFirstTime = true;

      eventSource.onerror = (err) => {
        console.error(err);
        rej(err);
      };

      eventSource.onmessage = (event) => {
        if (event.data === "FINISH") {
          eventSource.close();
          setMessages([
            ...newMessages,
            {
              role: "ai",
              text: allContent,
              sourceNodes: sources,
            },
          ]);
          return res(true);
        }

        if (!event.data) return;

        const data = JSON.parse(event.data) as ChatResponse;
        if (!data) return;

        allContent += data.response;
        sources = data.sourceNodes;

        if (isFirstTime) {
          isFirstTime = false;
          setMessages([
            ...newMessages,
            {
              role: "ai",
              text: allContent,
            },
          ]);
        } else {
          setMessages([
            ...newMessages,
            {
              role: "ai",
              text: allContent,
            },
          ]);
        }
        scrollToBottom();
      };
    });

    isPending.setFalse();
  };

  return {
    messages,
    question,
    setQuestion,
    sendQuestion,
    isPending: isPending.value,
    containerRef,
  };
}
