"use client";

import type { ButtonProps } from "@/components/ui/button";
import type { UseGlobalChatReturn } from "@/hooks/use-global-chat";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { Message } from "ai";
import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import { memo, useCallback, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { cn } from "@/lib/utils";
import { useChatFilters } from "@/stores/chat-filters";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon, Settings2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocalStorage, useWindowSize } from "usehooks-ts";

import { SuggestedActions } from "./suggested-actions";

export function useChatInput({
  input,
  setInput,
  handleSubmit,
  initialHeight = 130,
}: {
  input: UseChatHelpers["input"];
  setInput: UseChatHelpers["setInput"];
  handleSubmit: UseGlobalChatReturn["submit"];
  initialHeight?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${initialHeight}px`;
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    "",
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || "";
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const submitForm = useCallback(() => {
    void handleSubmit();

    setLocalStorageInput("");
    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [handleSubmit, setLocalStorageInput, width]);

  return {
    textareaRef,
    handleInput,
    submitForm,
  };
}

export function FiltersButton({
  open,
  setOpen,
  hideLabelOnMobile = false,
  ...props
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  hideLabelOnMobile?: boolean;
} & ButtonProps) {
  const t = useTranslations();
  const selectedBooksLength = useChatFilters((s) => s.selectedBooks.length);
  const selectedAuthorsLength = useChatFilters((s) => s.selectedAuthors.length);
  const selectedGenresLength = useChatFilters((s) => s.selectedGenres.length);

  const total =
    selectedBooksLength + selectedAuthorsLength + selectedGenresLength;

  return (
    <Button
      variant="outline"
      className={cn(
        "text-foreground gap-2 rounded-full",
        open &&
          "bg-primary-foreground dark:bg-primary/20 dark:text-primary-foreground hover:bg-primary/30 dark:hover:bg-primary/40 border-primary-foreground! dark:border-primary/20! text-primary hover:text-primary shadow-none",
      )}
      type="button"
      {...(setOpen && { onClick: () => setOpen(!open) })}
      {...props}
    >
      <Settings2Icon className="size-4" />
      <span className={cn(hideLabelOnMobile && "hidden sm:block")}>
        {t("chat.input.filters")}
      </span>

      {total > 0 && (
        <Badge
          variant="secondary"
          className="size-5 items-center justify-center rounded-full p-0 text-xs"
        >
          {total}
        </Badge>
      )}
    </Button>
  );
}

export function ActionContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute right-0 bottom-0 left-0 flex flex-row justify-between gap-3 px-5 py-4",
        className,
      )}
      {...props}
    />
  );
}

export function ChatTextarea({
  className,
  handleSubmit,
  ...props
}: React.ComponentProps<"textarea"> & {
  handleSubmit?: () => void;
}) {
  const t = useTranslations();

  return (
    <Textarea
      data-testid="multimodal-input"
      placeholder={t("chat.input.placeholder")}
      className={cn(
        "bg-background max-h-[75dvh] min-h-24 resize-none overflow-hidden rounded-3xl px-5 pt-5 pb-15 text-base shadow-[0px_16px_32px_0px_#0000000A]",
        className,
      )}
      rows={2}
      autoFocus
      onKeyDown={(event) => {
        if (
          event.key === "Enter" &&
          !event.shiftKey &&
          !event.nativeEvent.isComposing
        ) {
          event.preventDefault();

          handleSubmit?.();
        }
      }}
      {...props}
    />
  );
}

function PureMultimodalInput({
  input,
  setInput,
  append,
  messages,
  status,
  stop,
  setMessages,
  handleSubmit,
  className,
}: {
  input: UseChatHelpers["input"];
  setInput: UseChatHelpers["setInput"];
  status: UseChatHelpers["status"];
  stop: () => void;
  append: UseGlobalChatReturn["append"];
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  handleSubmit: UseGlobalChatReturn["submit"];
  className?: string;
}) {
  const filtersOpen = useChatFilters((s) => s.open);
  const setFiltersOpen = useChatFilters((s) => s.setOpen);
  const { textareaRef, handleInput, submitForm } = useChatInput({
    input,
    setInput,
    handleSubmit,
  });

  const { isAtBottom, scrollToBottom } = useScrollToBottom();

  useEffect(() => {
    if (status === "submitted") {
      scrollToBottom();
    }
  }, [status, scrollToBottom]);

  return (
    <div className="relative flex w-full flex-col gap-4">
      <AnimatePresence>
        {!isAtBottom && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute bottom-34 left-1/2 z-50 -translate-x-1/2"
          >
            <Button
              data-testid="scroll-to-bottom-button"
              className="rounded-full"
              size="icon"
              variant="outline"
              onClick={(event) => {
                event.preventDefault();
                scrollToBottom();
              }}
            >
              <ArrowDownIcon className="size-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {messages.length === 0 && <SuggestedActions append={append} />}

      <ChatTextarea
        ref={textareaRef}
        value={input}
        onChange={handleInput}
        className={cn(className)}
        handleSubmit={submitForm}
      />

      <ActionContainer>
        <FiltersButton open={filtersOpen} setOpen={setFiltersOpen} />
        {status === "submitted" ? (
          <StopButton stop={stop} setMessages={setMessages} />
        ) : (
          <SendButton input={input} submitForm={submitForm} />
        )}
      </ActionContainer>
    </div>
  );
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false;
    if (prevProps.status !== nextProps.status) return false;

    // cleared the chat
    if (nextProps.messages.length === 0 && prevProps.messages.length > 0)
      return false;

    return true;
  },
);

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
}) {
  return (
    <Button
      data-testid="stop-button"
      size="icon"
      className="rounded-full"
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => messages);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4"
      >
        <path
          fillRule="evenodd"
          d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z"
          clipRule="evenodd"
        />
      </svg>
    </Button>
  );
}

const StopButton = memo(PureStopButton);

function PureSendButton({
  submitForm,
  input,
}: {
  submitForm: () => void;
  input: string;
}) {
  return (
    <Button
      data-testid="send-button"
      size="icon"
      className="rounded-full"
      onClick={(event) => {
        event.preventDefault();
        submitForm();
      }}
      disabled={input.length === 0}
    >
      <ArrowUpIcon className="size-6" />
    </Button>
  );
}

export const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  return true;
});
