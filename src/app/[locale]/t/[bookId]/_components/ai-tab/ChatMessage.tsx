import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import {
  DocumentDuplicateIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { OpenAILogo } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useBoolean } from "usehooks-ts";
import { useTranslations } from "next-intl";
import { useReaderVirtuoso } from "../context";
import { memo, useCallback } from "react";
import type { UsePageNavigationReturnType } from "../usePageNavigation";
import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { useMutation } from "@tanstack/react-query";
import { sendFeedback } from "@/server/services/chat";

type ChatMessageProps = {
  id?: string;
  text: string;
  role: "ai" | "user";
  onRegenerate?: () => Promise<void>;
  sourceNodes?: SemanticSearchBookNode[];
  isLast?: boolean;
  hasActions?: boolean;
  isScreenshot?: boolean;
  getVirtuosoIndex: UsePageNavigationReturnType["getVirtuosoIndex"];
};

const ChatMessage = ({
  id,
  text,
  role,
  sourceNodes,
  isLast = true,
  hasActions = true,
  isScreenshot = false,
  onRegenerate,
  getVirtuosoIndex,
}: ChatMessageProps) => {
  const { toast } = useToast();
  const t = useTranslations();
  const virtuosoRef = useReaderVirtuoso();
  const isLoading = useBoolean(false);
  const didSendFeedback = useBoolean(false);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["send-feedback"],
    mutationFn: sendFeedback,
    onSuccess: () => {
      toast({
        variant: "primary",
        description: t("reader.feedback-submitted"),
      });
      didSendFeedback.setTrue();
    },
  });

  const handleNavigateToPage = useCallback(
    (page?: { vol: string; page: number }) => {
      if (!page) return;

      const props = getVirtuosoIndex(page);
      virtuosoRef.current?.scrollToIndex(props.index, { align: props.align });
    },
    [getVirtuosoIndex],
  );

  const handleRegenerate = useCallback(async () => {
    if (!onRegenerate) return;

    isLoading.setTrue();
    await onRegenerate();
    isLoading.setFalse();
  }, [onRegenerate]);

  const handleCopy = useCallback(async () => {
    isLoading.setTrue();
    await navigator.clipboard.writeText(text);
    toast({ description: t("reader.chat.copied") });
    isLoading.setFalse();
  }, [text]);

  const handleFeedback = useCallback(
    (type: "positive" | "negative") => {
      if (!id) return;
      mutateAsync({ messageId: id, feedback: type });
    },
    [id],
  );

  return (
    <div
      className={cn("flex", role === "ai" ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "chat-message max-w-[90%] text-wrap",
          "group text-foreground",
          role === "ai"
            ? "flex items-start gap-3"
            : "rounded-2xl bg-gray-200 px-4 dark:bg-accent",
          role === "user"
            ? isScreenshot
              ? "flex items-center justify-center py-3"
              : "py-2"
            : "",
        )}
      >
        {role === "ai" && (
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white dark:bg-accent dark:text-white">
            <OpenAILogo className="size-5 shrink-0" />
          </div>
        )}

        <div
          className={cn(
            "text-sm",
            isScreenshot && role === "user" ? "-mt-3" : "",
          )}
        >
          {text === "" ? (
            <div className="loader" />
          ) : (
            <ReactMarkdown>{text}</ReactMarkdown>
          )}

          {sourceNodes && sourceNodes.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-1">
              {t("reader.chat.sources")}:
              {sourceNodes?.slice(0, 5).map((sourceNode, idx) => {
                const page = sourceNode.metadata.pages[0];

                return (
                  <button
                    key={idx}
                    className="p-0 text-primary underline"
                    onClick={() => handleNavigateToPage(page)}
                  >
                    {t("reader.chat.pg-x", {
                      page: page?.page,
                    })}
                  </button>
                );
              })}
            </div>
          ) : null}

          {role === "ai" && hasActions && (
            <div
              className={cn(
                "message-actions",
                "mt-2 flex gap-1",
                !isLast &&
                  "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
              )}
            >
              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-gray-600 hover:bg-secondary"
                disabled={isLoading.value}
                onClick={handleCopy}
                tooltip={t("reader.chat.copy")}
              >
                <DocumentDuplicateIcon className="size-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-gray-600 hover:bg-secondary"
                disabled={isLoading.value}
                onClick={handleRegenerate}
                tooltip={t("reader.chat.regenerate")}
              >
                <ArrowPathIcon className="size-4" />
              </Button>

              {!didSendFeedback.value && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 text-gray-600 hover:bg-secondary"
                    disabled={isLoading.value || isPending}
                    onClick={() => handleFeedback("positive")}
                    tooltip={t("reader.chat.mark-as-correct")}
                  >
                    <HandThumbUpIcon className="size-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 text-gray-600 hover:bg-secondary"
                    disabled={isLoading.value || isPending}
                    onClick={() => handleFeedback("negative")}
                    tooltip={t("reader.chat.report-as-incorrect")}
                  >
                    <HandThumbDownIcon className="size-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ChatMessage);
