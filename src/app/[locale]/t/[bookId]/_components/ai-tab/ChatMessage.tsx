import { cn } from "@/lib/utils";
import ReactMarkdown, { type Components } from "react-markdown";
import {
  DocumentDuplicateIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon as SolidHandThumbUpIcon,
  HandThumbDownIcon as SolidHandThumbDownIcon,
} from "@heroicons/react/24/solid";
import { OpenAILogo } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useBoolean } from "usehooks-ts";
import { useTranslations } from "next-intl";
import { memo, useCallback, useMemo, useState } from "react";
import type { UsePageNavigationReturnType } from "../usePageNavigation";
import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import { useMutation } from "@tanstack/react-query";
import { sendFeedback } from "@/server/services/chat";
import makeSourcesPlugin from "./sources-plugin";
import rehypeRaw from "rehype-raw";
import PageReference from "./PageReference";

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

const makeComponents = (
  sourceNodes: SemanticSearchBookNode[],
  getVirtuosoIndex: ChatMessageProps["getVirtuosoIndex"],
): Components => ({
  // @ts-expect-error
  "page-reference": (props) => (
    <PageReference
      getVirtuosoIndex={getVirtuosoIndex}
      sourceNodes={sourceNodes}
      {...props}
    />
  ),
  ol: (props) => <ol className="flex flex-col gap-2" {...props} />,
  ul: (props) => <ul className="flex flex-col gap-2" {...props} />,
});

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

  const isLoading = useBoolean(false);
  const [feedbackSentType, setFeedbackSentType] = useState<
    "positive" | "negative" | null
  >(null);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["send-feedback"],
    mutationFn: sendFeedback,
    onSuccess: (_, { feedback }) => {
      toast({
        variant: "primary",
        description: t("reader.feedback-submitted"),
      });
      setFeedbackSentType(feedback);
    },
  });

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
      if (!id || feedbackSentType) return;
      mutateAsync({ messageId: id, feedback: type });
    },
    [id, feedbackSentType],
  );

  const sourcesPlugin = useMemo(() => {
    return {
      plugin: makeSourcesPlugin(
        (sourceNodes ?? []).map((_, idx) => {
          return idx + 1;
        }),
      ),
      components: makeComponents(sourceNodes ?? [], getVirtuosoIndex),
    };
  }, [sourceNodes, getVirtuosoIndex]);

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

        <bdi
          className={cn(
            "block text-sm",
            isScreenshot && role === "user" ? "-mt-3" : "",
          )}
        >
          {text === "" ? (
            <div className="loader" />
          ) : (
            <ReactMarkdown
              remarkPlugins={[sourcesPlugin.plugin]}
              rehypePlugins={[rehypeRaw]}
              components={sourcesPlugin.components}
              className="flex flex-col gap-3"
            >
              {text}
            </ReactMarkdown>
          )}

          {role === "ai" && hasActions && (
            <div
              className={cn(
                "message-actions mt-2 flex gap-1 text-muted-foreground",
                !isLast &&
                  "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
              )}
            >
              <Button
                size="icon"
                variant="ghost"
                className="size-7 hover:bg-secondary"
                disabled={isLoading.value}
                onClick={handleCopy}
                tooltip={t("reader.chat.copy")}
              >
                <DocumentDuplicateIcon className="size-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="size-7 hover:bg-secondary"
                disabled={isLoading.value}
                onClick={handleRegenerate}
                tooltip={t("reader.chat.regenerate")}
              >
                <ArrowPathIcon className="size-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="size-7 hover:bg-secondary"
                disabled={isLoading.value || isPending}
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
                className="size-7 hover:bg-secondary"
                disabled={isLoading.value || isPending}
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
          )}
        </bdi>
      </div>
    </div>
  );
};

export default memo(ChatMessage);
