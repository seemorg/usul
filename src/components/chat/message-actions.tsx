import type { UseGlobalChatReturn } from "@/hooks/use-global-chat";
import type { UIMessage } from "ai";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sendFeedback } from "@/server/services/chat";
import {
  ArrowPathIcon,
  DocumentDuplicateIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbDownIcon as SolidHandThumbDownIcon,
  HandThumbUpIcon as SolidHandThumbUpIcon,
} from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export const MessageActions = ({
  message,
  reload,
  chatId,
}: {
  chatId: string;
  message: UIMessage;
  reload: UseGlobalChatReturn["reload"];
}) => {
  const t = useTranslations();
  const [feedbackSentType, setFeedbackSentType] = useState<
    "positive" | "negative" | null
  >(null);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["send-feedback"],
    mutationFn: sendFeedback,
    onSuccess: (_, { feedback }) => {
      toast.success(t("reader.feedback-submitted"));
      setFeedbackSentType(feedback);
    },
  });

  const handleFeedback = (type: "positive" | "negative") => {
    if (!chatId || feedbackSentType) return;
    void mutateAsync({ messageId: chatId, feedback: type });
  };

  const handleCopy = async () => {
    const textFromParts = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n")
      .trim();

    if (!textFromParts) {
      toast.error("There's no text to copy!");
      return;
    }

    await navigator.clipboard.writeText(textFromParts);
    toast.success(t("reader.chat.copied"));
  };

  return (
    <div
      className={cn(
        "message-actions text-muted-foreground mt-2 flex gap-1",

        "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
        "group-hover/message:pointer-events-auto group-hover/message:opacity-100",
      )}
    >
      <Button
        size="icon"
        variant="ghost"
        className="hover:bg-secondary size-7"
        onClick={handleCopy}
        tooltip={t("reader.chat.copy")}
      >
        <DocumentDuplicateIcon className="size-4" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="hover:bg-secondary size-7"
        onClick={reload}
        tooltip={t("reader.chat.regenerate")}
      >
        <ArrowPathIcon className="size-4" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="hover:bg-secondary size-7"
        disabled={isPending}
        onClick={() => handleFeedback("positive")}
        tooltip={t("reader.chat.mark-as-correct")}
      >
        {feedbackSentType === "positive" ? (
          <SolidHandThumbUpIcon className="size-4" />
        ) : (
          <HandThumbUpIcon className="size-4" />
        )}
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="hover:bg-secondary size-7"
        disabled={isPending}
        onClick={() => handleFeedback("negative")}
        tooltip={t("reader.chat.report-as-incorrect")}
      >
        {feedbackSentType === "negative" ? (
          <SolidHandThumbDownIcon className="size-4" />
        ) : (
          <HandThumbDownIcon className="size-4" />
        )}
      </Button>
    </div>
  );
};
