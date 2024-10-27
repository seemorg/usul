"use client";

import * as React from "react";
import Textarea from "react-textarea-autosize";

import { Button } from "@/components/ui/button";

import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useEnterSubmit } from "@/hooks/useEnterSubmit";
import { useNavbarStore } from "@/stores/navbar";
import { cn } from "@/lib/utils";

function ChatForm({
  input,
  setInput,
  onSubmit,
  isPending,
}: {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (value: string) => void;
  isPending?: boolean;
}) {
  const showNavbar = useNavbarStore((s) => s.showNavbar);
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      ref={formRef}
      className={cn(
        "mt-5 shrink-0 px-4 transition-transform will-change-transform",
        showNavbar ? "-translate-y-4" : "translate-y-16",
      )}
      onSubmit={(e: any) => {
        e.preventDefault();

        if (isPending) return;

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target["message"]?.blur();
        }

        const value = input.trim();
        setInput("");
        if (!value) return;

        onSubmit(value);
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-white pr-8 dark:bg-accent sm:rounded-md sm:border sm:pr-12">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Type your question..."
          // className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          className="min-h-10 w-full resize-none px-4 py-2 focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="absolute right-3 top-1.5">
          <Button
            size="icon"
            type="submit"
            className="size-7 shrink-0 rounded-full"
            disabled={isPending || input === ""}
            tooltip="Send message"
          >
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ChatForm;
