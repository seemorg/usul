"use client";

import type { UseGlobalChatReturn } from "@/hooks/use-global-chat";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useChatFilters } from "@/stores/chat-filters";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/shallow";

interface SuggestedActionsProps {
  append: UseGlobalChatReturn["append"];
}

function PureSuggestedActions({ append }: SuggestedActionsProps) {
  const t = useTranslations();
  const hasFilters = useChatFilters(
    useShallow(
      (s) =>
        s.selectedAuthors.length +
        s.selectedGenres.length +
        s.selectedBooks.length,
    ),
  );

  if (hasFilters) return null;

  const actions = [
    t("chat.suggested_actions.one.long"),
    t("chat.suggested_actions.two.long"),
    t("chat.suggested_actions.three.long"),
    t("chat.suggested_actions.four.long"),
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid w-full gap-2 sm:grid-cols-2"
    >
      {actions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant="ghost"
            type="button"
            onClick={() => append(suggestedAction)}
            className="hover:bg-accent h-auto w-full flex-1 items-start justify-start gap-1 rounded-xl border px-4 py-3.5 text-left text-sm sm:flex-col"
          >
            <span>{suggestedAction}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions);
