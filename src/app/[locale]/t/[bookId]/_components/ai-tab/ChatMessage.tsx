import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import type { Components } from "react-markdown";
import { memo, useCallback, useMemo, useState } from "react";
import { OpenAILogo } from "@/components/Icons";
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
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { toast } from "sonner";
import { useBoolean } from "usehooks-ts";

import type { UsePageNavigationReturnType } from "../usePageNavigation";
import PageReference from "./PageReference";
import makeSourcesPlugin from "./sources-plugin";

type ChatMessageProps = {
  id?: string;
  text: string;
  role: "ai" | "user";
  onRegenerate?: () => Promise<void>;
  sourceNodes?: SemanticSearchBookNode[];
  isLast?: boolean;
  hasActions?: boolean;
  isScreenshot?: boolean;
  getVirtuosoScrollProps: UsePageNavigationReturnType["getVirtuosoScrollProps"];
};

const makeComponents = (
  sourceNodes: SemanticSearchBookNode[],
  getVirtuosoScrollProps: ChatMessageProps["getVirtuosoScrollProps"],
): Components => ({
  "page-reference": (props) => (
    <PageReference
      getVirtuosoScrollProps={getVirtuosoScrollProps}
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
  getVirtuosoScrollProps,
}: ChatMessageProps) => {
  const t = useTranslations();

  const isLoading = useBoolean(false);
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

  const handleRegenerate = useCallback(async () => {
    if (!onRegenerate) return;

    isLoading.setTrue();
    await onRegenerate();
    isLoading.setFalse();
  }, [onRegenerate]);

  const handleCopy = useCallback(async () => {
    isLoading.setTrue();
    await navigator.clipboard.writeText(text);
    toast.success(t("reader.chat.copied"));
    isLoading.setFalse();
  }, [text]);

  const handleFeedback = useCallback(
    (type: "positive" | "negative") => {
      if (!id || feedbackSentType) return;
      mutateAsync({ messageId: id, feedback: type });
    },
    [id, feedbackSentType],
  );

  const markdownProps = useMemo(() => {
    return {
      plugin: makeSourcesPlugin(
        (sourceNodes ?? []).map((_, idx) => {
          return idx + 1;
        }),
      ),
      components: makeComponents(sourceNodes ?? [], getVirtuosoScrollProps),
    };
  }, [sourceNodes, getVirtuosoScrollProps]);

  return (
    <div
      className={cn("flex", role === "ai" ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "chat-message max-w-full text-wrap @sm:max-w-[90%]",
          "text-foreground group",
          role === "ai"
            ? "flex flex-col items-start gap-3 @sm:flex-row"
            : "dark:bg-accent rounded-2xl bg-gray-200 px-4",
          role === "user"
            ? isScreenshot
              ? "flex items-center justify-center py-3"
              : "py-2"
            : "",
        )}
      >
        {role === "ai" && (
          <div className="dark:bg-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white dark:text-white">
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
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[markdownProps.plugin]}
              components={markdownProps.components}
              className="flex flex-col gap-3"
            >
              {text}
            </ReactMarkdown>
          )}

          {role === "ai" && hasActions && (
            <div
              className={cn(
                "message-actions text-muted-foreground mt-2 flex gap-1",
                !isLast &&
                  "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
              )}
            >
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-secondary size-7"
                disabled={isLoading.value}
                onClick={handleCopy}
                tooltip={t("reader.chat.copy")}
              >
                <DocumentDuplicateIcon className="size-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-secondary size-7"
                disabled={isLoading.value}
                onClick={handleRegenerate}
                tooltip={t("reader.chat.regenerate")}
              >
                <ArrowPathIcon className="size-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-secondary size-7"
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
                className="hover:bg-secondary size-7"
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
