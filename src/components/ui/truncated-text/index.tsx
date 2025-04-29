"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

import { Button } from "../button";

type TruncatedTextProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: string;
  maxLength?:
    | number
    | {
        desktop: number;
        mobile: number;
      };
};

export default function TruncatedText({
  children,
  maxLength: _maxLength = { desktop: 500, mobile: 200 },
  ...props
}: TruncatedTextProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("common");

  const maxLengthDesktop =
    typeof _maxLength === "number" ? _maxLength : _maxLength.desktop;
  const maxLengthMobile =
    typeof _maxLength === "number" ? null : _maxLength.mobile;

  const renderTruncatedText = (maxLength: number, className?: string) => {
    const showSeeMore = children.length > maxLength && !open;
    const showSeeLess = children.length > maxLength && open;
    const truncatedText = open
      ? children
      : children.length > maxLength
        ? `${children.slice(0, maxLength)}...`
        : children;

    return (
      <div className={className}>
        {truncatedText}

        {showSeeMore && (
          <TruncatedTextButton onClick={() => setOpen(true)}>
            {t("see-more")}
          </TruncatedTextButton>
        )}

        {showSeeLess && (
          <TruncatedTextButton onClick={() => setOpen(false)}>
            {t("see-less")}
          </TruncatedTextButton>
        )}
      </div>
    );
  };

  return (
    <div {...props}>
      {renderTruncatedText(
        maxLengthDesktop,
        cn(maxLengthMobile !== null && "hidden sm:block"),
      )}

      {maxLengthMobile !== null &&
        renderTruncatedText(maxLengthMobile, "sm:hidden")}
    </div>
  );
}

const TruncatedTextButton = (props: React.ComponentProps<typeof Button>) => {
  return (
    <Button
      variant="link"
      className="h-auto px-0 py-0 text-lg font-normal ltr:ml-2 rtl:mr-2"
      {...props}
    />
  );
};
