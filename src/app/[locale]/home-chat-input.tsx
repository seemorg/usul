"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGlobalChat } from "@/hooks/use-global-chat";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import { useTranslations } from "next-intl";

import SearchBar from "../../components/navbar/search-bar";
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
  const { input, setInput, submit } = useGlobalChat({
    shouldRedirect: true,
    initialId,
  });
  const { textareaRef, handleInput, submitForm } = useChatInput({
    input,
    setInput,
    handleSubmit: submit,
    initialHeight: 135,
  });

  if (tab === "search") {
    return (
      <div className="flex max-w-3xl flex-col gap-4">
        <SearchBar size="lg" />

        <Tabs
          className={cn("text-foreground gap-2 rounded-full")}
          value={tab}
          onValueChange={(value) => setTab(value as "ai" | "search")}
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
      </div>
    );
  }

  return (
    <>
      <div className="text-foreground relative flex w-full flex-col gap-4">
        <ChatTextarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          handleSubmit={submitForm}
          className="min-h-33.75 pt-5 pb-16"
        />

        <ActionContainer className="md:justify-between">
          <Tabs
            className="text-foreground gap-2 rounded-full"
            value={tab}
            onValueChange={(value) => setTab(value as "ai" | "search")}
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
            <SendButton input={input} submitForm={submitForm} />
          </div>
        </ActionContainer>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {[
          t("chat.suggested_actions.one.short"),
          t("chat.suggested_actions.two.short"),
          t("chat.suggested_actions.three.short"),
          t("chat.suggested_actions.four.short"),
        ].map((item) => (
          <Badge
            key={item}
            className="cursor-pointer rounded-3xl px-3 py-1.5 text-sm font-normal"
            variant="muted"
            onClick={() => setInput(item)}
          >
            {item}
          </Badge>
        ))}
      </div>
    </>
  );
};
