"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { memo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useEnterSubmit } from "@/hooks/useEnterSubmit";
import { cn } from "@/lib/utils";
import { useNavbarStore } from "@/stores/navbar";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";
import Textarea from "react-textarea-autosize";
import { toast } from "sonner";

function PureChatInput({
  input,
  status,
  setInput,
  onSubmit,
}: {
  input: string;
  status: UseChatHelpers["status"];
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const showNavbar = useNavbarStore((s) => s.showNavbar);
  const { formRef, onKeyDown } = useEnterSubmit();
  const t = useTranslations("reader");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      ref={formRef}
      className={cn("mt-5 shrink-0 px-4")}
      onSubmit={(e) => {
        if (status !== "ready") {
          toast.error("Please wait for the model to finish its response!");
          return;
        }

        onSubmit(e);

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          (e.target as HTMLFormElement)["message"]?.blur();
        }
      }}
    >
      <div className="bg-input relative flex max-h-60 w-full grow flex-col overflow-hidden rounded-md ltr:pr-8 sm:ltr:pr-12 rtl:pl-8 sm:rtl:pl-12">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder={t("chat.placeholder")}
          // className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-hidden sm:text-sm"
          className="text-secondary-foreground min-h-[2.5rem] w-full resize-none bg-transparent px-5 py-3 text-base focus-within:outline-hidden"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="absolute top-2 ltr:right-3 rtl:left-3">
          <Button
            size="icon"
            type="submit"
            className="size-8 shrink-0 rounded-full"
            disabled={status === "submitted" || input === ""}
            tooltip={t("chat.send-message")}
          >
            <ArrowRightIcon className="size-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </form>
  );
}

export const ChatInput = memo(PureChatInput, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.status !== nextProps.status) return false;

  return true;
});
