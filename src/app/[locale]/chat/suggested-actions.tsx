"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const actions = [
  {
    title: "Sahih Bukhari",
    label: "What are the pillars of Islam?",
  },
  {
    title: "Sahih Muslim",
    label: "Who is the author of the book?",
  },
  {
    title: "Muwatta Imam Malik",
    label: "What is the ruling on fasting friday?",
  },
  {
    title: "Sunan Abu Dawud",
    label: "What to say when someone dies?",
  },
];

interface SuggestedActionsProps {
  append: UseChatHelpers["append"];
}

function PureSuggestedActions({ append }: SuggestedActionsProps) {
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
            onClick={() => {
              void append({
                role: "user",
                content: suggestedAction.label,
              });
            }}
            className="hover:bg-background bg-background/50 h-auto w-full flex-1 items-start justify-start gap-1 rounded-xl border px-4 py-3.5 text-left text-sm sm:flex-col"
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
