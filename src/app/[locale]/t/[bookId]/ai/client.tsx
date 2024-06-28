"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import type { ChatResponse } from "@/types/chat";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/20/solid";
import {
  DocumentDuplicateIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
// import { BotIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import useChat from "./useChat";
import { useNavbarStore } from "@/stores/navbar";
import { OpenAILogo } from "@/components/Icons";

type ChatMessage = {
  text: string;
  role: "ai" | "user";
  sourceNodes?: ChatResponse["sourceNodes"];
  isLast?: boolean;
};

const Message = ({ text, role, sourceNodes, isLast = true }: ChatMessage) => (
  <div className={cn("flex", role === "ai" ? "justify-start" : "justify-end")}>
    <div
      className={cn(
        "group max-w-[90%] text-foreground",
        role === "ai"
          ? "flex items-start gap-3"
          : "rounded-2xl bg-gray-200 px-4 py-2 dark:bg-accent",
      )}
    >
      {role === "ai" && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white dark:bg-accent">
          <OpenAILogo className="size-5 shrink-0" />
        </div>
      )}

      <div className="text-sm">
        <ReactMarkdown>{text}</ReactMarkdown>

        {sourceNodes ? (
          <div className="mt-4 flex flex-wrap items-center gap-1">
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

        {role === "ai" && (
          <div
            className={cn(
              "mt-2 flex gap-1",
              !isLast &&
                "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
            )}
          >
            <Button
              size="icon"
              variant="ghost"
              className="size-7 text-gray-600 hover:bg-secondary"
            >
              <DocumentDuplicateIcon className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-7 text-gray-600 hover:bg-secondary"
            >
              <ArrowPathIcon className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-7 text-gray-600 hover:bg-secondary"
            >
              <HandThumbUpIcon className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-7 text-gray-600 hover:bg-secondary"
            >
              <HandThumbDownIcon className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function AITab({ bookSlug }: { bookSlug: string }) {
  const showNavbar = useNavbarStore((s) => s.showNavbar);
  const {
    isPending,
    question,
    setQuestion,
    sendQuestion,
    containerRef,
    messages,
  } = useChat({ bookSlug });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await sendQuestion();
  };

  return (
    <div className="pb-2">
      <div className="flex items-center justify-between px-4">
        Chat
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="size-10 hover:bg-secondary"
          >
            <ArrowUpTrayIcon className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-10 hover:bg-secondary"
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "mt-4 flex h-[calc(100vh-320px)] flex-col gap-5 overflow-y-auto px-4",
          showNavbar ? "" : "",
        )}
        ref={containerRef}
      >
        {messages.map((message, idx) => (
          <Message
            key={idx}
            role={message.role}
            text={message.text}
            sourceNodes={message.sourceNodes}
            isLast={idx === messages.length - 1}
          />
        ))}
        {/* <Message role="user" text="What is the meaning of life?" />
        <Message
          role="ai"
          text="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus accusantium totam molestias eveniet animi iure et voluptas laborum illo repellendus. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus accusantium totam molestias eveniet animi iure et voluptas laborum illo repellendus."
        /> */}
      </div>

      <form
        className={cn(
          "mt-5 flex px-4 transition-transform will-change-transform",
          showNavbar ? "" : "translate-y-16",
        )}
        onSubmit={onSubmit}
      >
        <Input
          className="h-10 flex-1 rounded-r-none bg-white dark:bg-accent"
          placeholder="Type your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isPending}
        />

        <Button
          size="icon"
          type="submit"
          className="size-10 shrink-0 rounded-l-none"
          disabled={isPending}
        >
          <ArrowRightIcon className="size-5" />
        </Button>
      </form>
    </div>
  );
}
