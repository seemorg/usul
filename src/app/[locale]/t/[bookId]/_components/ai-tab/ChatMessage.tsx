import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import {
  DocumentDuplicateIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import { OpenAILogo } from "@/components/Icons";
import type { ChatResponse } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import { useToast } from "@/components/ui/use-toast";
import { useBoolean } from "usehooks-ts";

type ChatMessageProps = {
  text: string;
  role: "ai" | "user";
  onRegenerate?: () => Promise<void>;
  sourceNodes?: ChatResponse["sourceNodes"];
  isLast?: boolean;
  hasActions?: boolean;
  isScreenshot?: boolean;
};

const ChatMessage = ({
  text,
  role,
  sourceNodes,
  isLast = true,
  hasActions = true,
  isScreenshot = false,
  onRegenerate,
}: ChatMessageProps) => {
  const { toast } = useToast();
  const isLoading = useBoolean(false);

  const handleRegenerate = async () => {
    if (!onRegenerate) return;

    isLoading.setTrue();
    await onRegenerate();
    isLoading.setFalse();
  };

  const handleCopy = async () => {
    isLoading.setTrue();
    await navigator.clipboard.writeText(text);
    toast({ description: "Copied to clipboard!" });
    isLoading.setFalse();
  };

  const handleFeedback = (type: "positive" | "negative") => {};

  return (
    <div
      className={cn("flex", role === "ai" ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "max-w-[90%] text-wrap",
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
        {/* <div class="loader"></div>  */}
        {/* .loader {
  width: 60px;
  aspect-ratio: 2;
  --_g: no-repeat radial-gradient(circle closest-side,#000 90%,#0000);
  background: 
    var(--_g) 0%   50%,
    var(--_g) 50%  50%,
    var(--_g) 100% 50%;
  background-size: calc(100%/3) 50%;
  animation: l3 1s infinite linear;
}
@keyframes l3 {
    20%{background-position:0%   0%, 50%  50%,100%  50%}
    40%{background-position:0% 100%, 50%   0%,100%  50%}
    60%{background-position:0%  50%, 50% 100%,100%   0%}
    80%{background-position:0%  50%, 50%  50%,100% 100%}
} */}
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
          <ReactMarkdown>{text}</ReactMarkdown>

          {sourceNodes ? (
            <div className="mt-4 flex flex-wrap items-center gap-1">
              Sources:
              {sourceNodes?.slice(0, 3).map((sourceNode, idx) => (
                <Link
                  key={idx}
                  href={navigation.books.reader(sourceNode.metadata.bookSlug)}
                  target="_blank"
                  className="flex items-center gap-1 text-primary underline"
                >
                  Pg {sourceNode.metadata.page}
                  <ArrowUpRightIcon className="h-4 w-4" />
                </Link>
              ))}
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
              >
                <DocumentDuplicateIcon className="size-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-gray-600 hover:bg-secondary"
                disabled={isLoading.value}
                onClick={handleRegenerate}
              >
                <ArrowPathIcon className="size-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-gray-600 hover:bg-secondary"
                disabled={isLoading.value}
                onClick={() => handleFeedback("positive")}
              >
                <HandThumbUpIcon className="size-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-gray-600 hover:bg-secondary"
                disabled={isLoading.value}
                onClick={() => handleFeedback("negative")}
              >
                <HandThumbDownIcon className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
