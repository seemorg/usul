"use client";

import { useMemo, useState } from "react";
import HomepageSearchBar from "@/components/navbar/search-bar/homepage";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGlobalChat } from "@/hooks/use-global-chat";
import { nanoid } from "nanoid";
import { useTranslations } from "next-intl";

import {
  ActionContainer,
  ChatTextarea,
  FiltersButton,
  SendButton,
  useChatInput,
} from "./chat/chat-input";
import HomepageFilters from "./chat/filters/homepage-filters";

export const HomepageChatInput = () => {
  const t = useTranslations();
  const initialId = useMemo(() => nanoid(), []);
  const [tab, setTab] = useState<"ai" | "search">("ai");

  // Shared input state for both chat and search
  const [sharedInput, setSharedInput] = useState("");

  const { input, setInput, submit } = useGlobalChat({
    shouldRedirect: true,
    initialId,
  });

  // Sync shared input with chat input when on AI tab
  const effectiveInput = tab === "ai" ? input : sharedInput;
  const effectiveSetInput = tab === "ai" ? setInput : setSharedInput;

  // When switching to AI tab, sync the shared input to chat input
  const handleTabChange = (newTab: "ai" | "search") => {
    if (newTab === "ai" && tab === "search") {
      setInput(sharedInput);
    } else if (newTab === "search" && tab === "ai") {
      setSharedInput(input);
    }
    setTab(newTab);
  };

  const { textareaRef, handleInput, submitForm } = useChatInput({
    input: effectiveInput,
    setInput: effectiveSetInput,
    handleSubmit: submit,
    initialHeight: 135,
  });

  const examples = (
    <div className="mt-10 flex flex-wrap justify-center gap-3">
      {(["one", "two", "three", "four"] as const).map((item) => {
        const text = t(`chat.suggested_actions.${item}.short`);
        const longText = t(`chat.suggested_actions.${item}.long`);
        return (
          <Badge
            key={item}
            className="cursor-pointer rounded-3xl px-3 py-1.5 text-sm font-normal"
            variant="muted"
            onClick={() => effectiveSetInput(longText)}
          >
            {text}
          </Badge>
        );
      })}
    </div>
  );

  if (tab === "search") {
    return (
      <>
        <HomepageSearchBar
          setTab={handleTabChange}
          value={sharedInput}
          setValue={setSharedInput}
        />
        <div className="pointer-events-none opacity-0">{examples}</div>
      </>
    );
  }

  return (
    <>
      <div className="text-foreground relative flex w-full flex-col gap-4">
        <ChatTextarea
          ref={textareaRef}
          value={effectiveInput}
          onChange={handleInput}
          handleSubmit={submitForm}
          className="min-h-33.75 pt-5 pb-16"
        />

        <ActionContainer className="md:justify-between">
          <Tabs
            className="text-foreground gap-2 rounded-full"
            value={tab}
            onValueChange={(value) => handleTabChange(value as "ai" | "search")}
          >
            <TabsList className="rounded-3xl">
              <TabsTrigger value="ai" className="rounded-3xl">
                {t("chat.input.ai_chat")}
              </TabsTrigger>
              <TabsTrigger value="search" className="rounded-3xl">
                {t("chat.input.search")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <HomepageFilters trigger={<FiltersButton hideLabelOnMobile />} />
            <SendButton input={effectiveInput} submitForm={submitForm} />
          </div>
        </ActionContainer>
      </div>

      {examples}
    </>
  );
};
