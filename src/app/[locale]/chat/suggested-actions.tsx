"use client";

import type { UseGlobalChatReturn } from "@/hooks/use-global-chat";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface SuggestedActionsProps {
  append: UseGlobalChatReturn["append"];
}

function PureSuggestedActions({ append }: SuggestedActionsProps) {
  const t = useTranslations();

  const actions = [
    {
      title: t("chat.suggested_actions.sahih_bukhari.title"),
      label: t("chat.suggested_actions.sahih_bukhari.label"),
    },
    {
      title: t("chat.suggested_actions.sahih_muslim.title"),
      label: t("chat.suggested_actions.sahih_muslim.label"),
    },
    {
      title: t("chat.suggested_actions.muwatta_imam_malik.title"),
      label: t("chat.suggested_actions.muwatta_imam_malik.label"),
    },
    {
      title: t("chat.suggested_actions.sunan_abu_dawud.title"),
      label: t("chat.suggested_actions.sunan_abu_dawud.label"),
    },
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
            onClick={() => {
              void append(suggestedAction.label);
            }}
            className="hover:bg-accent h-auto w-full flex-1 items-start justify-start gap-1 rounded-xl border px-4 py-3.5 text-left text-sm sm:flex-col"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions);
