"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowUpTrayIcon,
  PencilSquareIcon,
  ArrowDownIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import ChatForm from "../../t/[bookId]/_components/ai-tab/ChatForm";
import { cn } from "@/lib/utils";
import useChat from "../../t/[bookId]/_components/ai-tab/useChat";
import { useScrollAnchor } from "../../t/[bookId]/_components/ai-tab/useScrollAnchor";
import { useCallback, useRef, useState } from "react";
import { useBoolean } from "usehooks-ts";
import ChatMessage from "../../t/[bookId]/_components/ai-tab/ChatMessage";
import { usePageNavigation } from "../../t/[bookId]/_components/usePageNavigation";
import { PlusIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function ChatPage() {
  const [numbersOfChats, setNumbersOfChats] = useState(1);

  const addChat = () => {
    if (numbersOfChats < 3) {
      setNumbersOfChats(numbersOfChats + 1);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background pt-16 lg:pt-20">
      <main className="mt-10 flex w-full">
        {Array.from({ length: numbersOfChats }).map((_, index) => (
          <ChatBox key={index} />
        ))}
      </main>

      <aside className="flex w-24 flex-col items-center gap-5 bg-primary-foreground py-10">
        <Button
          size="icon"
          variant="ghost"
          className="size-12 hover:bg-primary/30"
          tooltip="New Chat"
          onClick={addChat}
        >
          <PlusIcon className="size-6" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="size-12 hover:bg-primary/30"
          tooltip="Chat History"
        >
          <ClockIcon className="size-6" />
        </Button>
      </aside>
    </div>
  );
}

const ChatBox = () => {
  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();
  const {
    isPending,
    question,
    setQuestion,
    sendQuestion,
    messages,
    clearChat,
    regenerateResponse,
  } = useChat({ bookSlug: "sahih" });
  const captureRef = useRef<HTMLDivElement>(null);
  const isSavingImage = useBoolean(false);

  // const { pageToIndex, pagesRange } = usePageNavigation({} as any);
  const { pageToIndex, pagesRange } = {
    pageToIndex: {},
    pagesRange: { start: 0, end: 0 },
  };

  const onSubmit = useCallback(async () => {
    await sendQuestion();
  }, [sendQuestion]);

  return (
    <div className="flex-1">
      <nav className="flex w-full justify-between px-10">
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-3" variant="secondary">
                <ChevronDownIcon className="size-3" />
                Saved
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Save these filters to apply them later
                </DialogTitle>
              </DialogHeader>

              <div>
                <p className="text-xs">
                  Note: saved filters are stored in the browser local storage
                  and are not accessible on other devices
                </p>

                <div className="mt-5">
                  <div>
                    <p className="font-bold">Books:</p>
                    <ul className="list-inside list-disc text-sm">
                      <li>Book 1</li>
                      <li>Book 2</li>
                      <li>Book 3</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-10">
                  <div className="flex gap-3">
                    <Button>Save</Button>
                    <Button variant="ghost">Cancel</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button className="gap-3" variant="secondary">
            <ChevronDownIcon className="size-3" />
            Books
          </Button>

          <Button className="gap-3" variant="secondary">
            <ChevronDownIcon className="size-3" />
            Authors
          </Button>

          <Button className="gap-3" variant="secondary">
            <ChevronDownIcon className="size-3" />
            Genres
          </Button>
        </div>

        <div>
          <Button
            size="icon"
            variant="ghost"
            className="size-10 hover:bg-secondary"
            // onClick={handleShareChat}
            // disabled={isLoading}
            // tooltip={t("chat.share-chat")}
          >
            <ArrowUpTrayIcon className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="size-10 hover:bg-secondary"
            // onClick={clearChat}
            // disabled={isLoading}
            // tooltip={t("chat.new-chat")}
          >
            <PencilSquareIcon className="size-4" />
          </Button>
        </div>
      </nav>

      <Separator className="my-5" />

      <div className="px-10">
        <div
          className={cn("flex h-[calc(100vh-240px)] flex-col justify-between")}
        >
          <div className="relative flex-1 overflow-hidden">
            {!isAtBottom && (
              <div className="absolute bottom-0 left-1/2 right-1/2 -translate-x-1/2">
                <Button
                  size="icon"
                  className="size-8 rounded-full"
                  onClick={scrollToBottom}
                >
                  <ArrowDownIcon className="size-4" />
                </Button>
              </div>
            )}

            <div
              className={
                "h-full w-full overflow-y-auto px-4 [&_.chat-message]:max-w-[600px]"
              }
              ref={scrollRef}
            >
              <div
                ref={messagesRef}
                className="flex flex-col gap-5 pb-[30px] pt-4"
              >
                <ChatMessage
                  role="ai"
                  text="Hey there, send something to start the chat!"
                  hasActions={false}
                  pagesRange={pagesRange}
                  pageToIndex={pageToIndex}
                />

                <ChatMessage
                  role="user"
                  text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus assumenda "
                  hasActions={false}
                  pagesRange={pagesRange}
                  pageToIndex={pageToIndex}
                />

                <ChatMessage
                  role="ai"
                  text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus assumenda voluptas debitis accusantium magnam excepturi laudantium neque laborum fugiat officia!"
                  hasActions
                  pagesRange={pagesRange}
                  pageToIndex={pageToIndex}
                />

                <ChatMessage
                  role="user"
                  text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus assumenda "
                  hasActions={false}
                  pagesRange={pagesRange}
                  pageToIndex={pageToIndex}
                />

                <ChatMessage
                  role="ai"
                  text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus assumenda voluptas debitis accusantium magnam excepturi laudantium neque laborum fugiat officia!"
                  hasActions
                  pagesRange={pagesRange}
                  pageToIndex={pageToIndex}
                />

                <ChatMessage
                  role="user"
                  text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus assumenda "
                  hasActions={false}
                  pagesRange={pagesRange}
                  pageToIndex={pageToIndex}
                />

                <ChatMessage
                  role="ai"
                  text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus assumenda voluptas debitis accusantium magnam excepturi laudantium neque laborum fugiat officia!"
                  hasActions
                  pagesRange={pagesRange}
                  pageToIndex={pageToIndex}
                />

                <ChatMessage
                  role="user"
                  text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus assumenda "
                  hasActions={false}
                  pagesRange={pagesRange}
                  pageToIndex={pageToIndex}
                />

                <ChatMessage
                  role="ai"
                  text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus assumenda voluptas debitis accusantium magnam excepturi laudantium neque laborum fugiat officia!"
                  hasActions
                  pagesRange={pagesRange}
                  pageToIndex={pageToIndex}
                />

                <ChatMessage
                  role="user"
                  text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus assumenda "
                  hasActions={false}
                  pagesRange={pagesRange}
                  pageToIndex={pageToIndex}
                />

                <ChatMessage
                  role="ai"
                  text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus assumenda voluptas debitis accusantium magnam excepturi laudantium neque laborum fugiat officia!"
                  hasActions
                  pagesRange={pagesRange}
                  pageToIndex={pageToIndex}
                />

                {messages.map((message, idx) => (
                  <ChatMessage
                    key={idx}
                    role={message.role}
                    text={message.text}
                    sourceNodes={message.sourceNodes}
                    isLast={idx === messages.length - 1}
                    hasActions={
                      idx === messages.length - 1 && isPending ? false : true
                    }
                    onRegenerate={() => regenerateResponse(idx)}
                    pagesRange={pagesRange}
                    pageToIndex={pageToIndex}
                  />
                ))}

                <div className="h-px w-full" ref={visibilityRef} />
              </div>
            </div>
          </div>

          <ChatForm
            input={question}
            setInput={setQuestion}
            onSubmit={onSubmit}
            isPending={isPending}
          />
        </div>
      </div>
    </div>
  );
};
