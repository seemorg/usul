"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";

export function ExpandableDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const t = useTranslations("common");
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    // When collapsed, check if content overflows the 5-line clamp
    if (!expanded) {
      const overflow = el.scrollHeight > el.clientHeight;
      setHasOverflow(overflow);
    }
  }, [expanded, children]);

  const showToggle = hasOverflow;

  const content =
    typeof children === "string" ? (
      <Markdown>{children}</Markdown>
    ) : (
      children
    );

  return (
    <div className={className}>
      <div
        ref={contentRef}
        className={
          expanded
            ? "text-secondary text text-justify dark:text-gray-300"
            : "text-secondary text line-clamp-5 text-justify dark:text-gray-300"
        }
      >
        {content}
      </div>
      {showToggle && (
        <Button
          variant="link"
          size="sm"
          className="text-secondary mt-1 h-auto p-0 font-normal underline-offset-2 dark:text-gray-300"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? t("show-less") : t("show-more")}
        </Button>
      )}
    </div>
  );
}
