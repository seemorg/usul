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
        showNavbar ? "translate-y-2.5" : "translate-y-[5.5rem]",
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
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden rounded-3xl bg-input pr-8 sm:pr-12">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Type your question..."
          // className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          className="min-h-[3.5rem] w-full resize-none bg-transparent px-5 py-4 text-base text-secondary-foreground focus-within:outline-none"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="absolute right-3 top-2.5">
          <Button
            size="icon"
            type="submit"
            className="size-9 shrink-0 rounded-full"
            disabled={isPending || input === ""}
            tooltip="Send message"
          >
            <ArrowRightIcon className="size-5" />
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ChatForm;
