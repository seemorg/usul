"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Button } from "../ui/button";

export default function SearchResultItem({
  expandedContent,
  collapsedContent,
}: {
  expandedContent: React.ReactNode;
  collapsedContent: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const Icon = open ? ChevronUpIcon : ChevronDownIcon;
  const children = open ? expandedContent : collapsedContent;

  return (
    <div
      className={cn(
        "relative flex w-full flex-col gap-2 rounded-md border border-gray-300 p-4 pl-16 shadow-sm",
        !open && "h-[100px] justify-center",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-[50px] -translate-y-1/2"
        onClick={() => setOpen(!open)}
      >
        <Icon className="h-5 w-5" />
      </Button>
      {children}
    </div>
  );
}
