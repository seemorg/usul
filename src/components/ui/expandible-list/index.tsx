"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useFormatter } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

interface ExpandibleListProps {
  items: string[];
  triggerItems?: string[];
  maxItems?: number; // items to show in the trigger
  noun?: {
    singular: string;
    plural: string;
  };
}

export function ExpandibleList({
  items,
  maxItems = 1,
  noun = {
    singular: "item",
    plural: "items",
  },
  triggerItems,
}: ExpandibleListProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const formatter = useFormatter();

  const namesList = (
    <ul className="mt-5 flex flex-col gap-4">
      {items.map((name, index) => (
        <li key={index}>- {name}</li>
      ))}
    </ul>
  );

  const getTriggerText = () => {
    const count = items.length - maxItems;
    const itemsToShow = (triggerItems ?? items).slice(0, maxItems);

    if (items.length <= maxItems) {
      return formatter.list(itemsToShow);
    }

    return formatter.list(
      [
        ...itemsToShow,
        ` ${formatter.number(count)} ${(count === 1 ? noun.singular : noun.plural).toLowerCase()}`,
      ],
      {
        type: "conjunction",
      },
    );
  };

  const trigger = (
    <Button variant="link" className="h-auto p-0">
      {getTriggerText()}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="capitalize">{noun.plural}</DialogTitle>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto">{namesList}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Other {noun.plural}</DrawerTitle>
        </DrawerHeader>

        <div className="max-h-[400px] overflow-y-auto px-4">{namesList}</div>

        <DrawerFooter className="mt-5">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
