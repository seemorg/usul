"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { useRef, useState } from "react";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";

type MessageType = {
  text: string;
  role: "ai" | "user";
  sourceNodes?: ChatResponse["sourceNodes"];
};

const Message = ({ text, role, sourceNodes }: MessageType) => (
  <div className={cn("flex", role === "ai" ? "justify-start" : "justify-end")}>
    <div
      className={cn(
        "max-w-[50%] rounded-xl p-3",
        role === "ai"
          ? "bg-primary-foreground text-black"
          : "bg-primary text-white",
      )}
    >
      <ReactMarkdown>{text}</ReactMarkdown>

      {sourceNodes ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          Sources:
          {sourceNodes?.slice(0, 3).map((sourceNode, idx) => (
            <Link
              key={idx}
              href={navigation.books.reader(sourceNode.metadata.bookSlug)}
              target="_blank"
              className="flex items-center gap-1 text-primary underline"
            >
              Pg {sourceNode.metadata.page}
              <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  </div>
);

type ChatResponse = {
  response: string;
  sourceNodes?: SemanticSearchBookNode[];
  metadata: Record<string, unknown>;
};

export default function ChatWindow({ bookSlug }: { bookSlug: string }) {
  const [question, setQuestion] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const { isPending, isError, mutateAsync } = useMutation<
    ChatResponse,
    Error,
    { question: string; messages: typeof messages }
  >({
    mutationKey: ["chat", bookSlug],
    mutationFn: async ({ question, messages: msgs }) => {
      return await fetch(
        `${env.NEXT_PUBLIC_SEMANTIC_SEARCH_URL}/chat/${bookSlug}`,
        {
          method: "POST",
          body: JSON.stringify({ question, messages: msgs }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      ).then((res) => res.json());
    },
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const q = question.trim();
    const msgs = [...messages];

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setQuestion("");

    const response = await mutateAsync({ question: q, messages: msgs });

    console.log(response);

    if (response) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: response.response,
          sourceNodes: response.sourceNodes,
        },
      ]);

      setTimeout(() => {
        // Scroll to the bottom
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 0);
    }
  };

  return (
    <>
      <div
        className="flex h-[700px] flex-col gap-3 overflow-y-auto"
        ref={containerRef}
      >
        {messages.map((message, idx) => (
          <Message
            key={idx}
            role={message.role}
            text={message.text}
            sourceNodes={message.sourceNodes}
          />
        ))}
      </div>

      <form className="mt-5 flex gap-3" onSubmit={onSubmit}>
        <Input
          className="flex-1"
          placeholder="Type your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isPending}
        />

        <Button size="icon" type="submit" disabled={isPending}>
          <ArrowRightIcon className="h-5 w-5" />
        </Button>
      </form>
    </>
  );
}
