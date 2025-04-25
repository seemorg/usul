import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import type { ComponentProps } from "react";
import { Badge } from "./ui/badge";

interface EntityCardProps extends ComponentProps<typeof Link> {
  tags?: (string | boolean | undefined | null)[];

  primaryTitle: string;
  secondaryTitle?: string;

  primarySubtitle?: string;
  secondarySubtitle?: string;
}

export default function EntityCard({
  className,
  tags,
  primaryTitle,
  secondaryTitle,
  primarySubtitle,
  secondarySubtitle,
  ...props
}: EntityCardProps) {
  const filteredTags = (tags?.filter(Boolean) ?? []) as string[];

  return (
    <Link
      className={cn(
        "w-full border-b border-border bg-transparent px-2 py-4 transition-colors hover:bg-secondary/50 dark:hover:bg-secondary/20 sm:px-3",
        className,
      )}
      {...props}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex-1">
          <h3
            className="text-base font-semibold"
            dangerouslySetInnerHTML={{ __html: primaryTitle }}
          />
        </div>

        {secondaryTitle && (
          <bdi className="flex-1">
            <h3
              className="text-base font-semibold"
              dangerouslySetInnerHTML={{ __html: secondaryTitle }}
            />
          </bdi>
        )}
      </div>

      <div className="mt-2 flex w-full items-start justify-between gap-3">
        {primarySubtitle && (
          <bdi className="block flex-1 text-xs text-secondary-foreground">
            {primarySubtitle}
          </bdi>
        )}

        {secondarySubtitle && (
          <bdi className="block flex-1 text-xs text-secondary-foreground">
            {secondarySubtitle}
          </bdi>
        )}
      </div>

      {filteredTags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {filteredTags.map((tag) => (
            <Badge key={tag} variant="muted" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
