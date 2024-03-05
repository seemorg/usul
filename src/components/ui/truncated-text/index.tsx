"use client";

import { useState } from "react";
import { Button } from "../button";

type TruncatedTextProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: string;
  maxLength?: number;
};

export default function TruncatedText({
  children,
  maxLength = 500, // 200 on mobile
  ...props
}: TruncatedTextProps) {
  const [open, setOpen] = useState(false);

  const showSeeMore = children.length > maxLength && !open;
  const showSeeLess = children.length > maxLength && open;

  const truncatedText = open
    ? children
    : children.length > maxLength
      ? `${children.slice(0, maxLength)}...`
      : children;

  return (
    <div {...props}>
      {truncatedText}

      {showSeeMore && (
        <Button
          variant="link"
          onClick={() => setOpen(true)}
          className="ml-2 px-0 py-0 text-lg font-normal"
        >
          See more
        </Button>
      )}

      {showSeeLess && (
        <Button
          variant="link"
          onClick={() => setOpen(false)}
          className="ml-2 px-0 py-0 text-lg"
        >
          See less
        </Button>
      )}
    </div>
  );
}
