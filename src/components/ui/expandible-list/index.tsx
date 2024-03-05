"use client";

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
import { useMediaQuery } from "usehooks-ts";
import { useState } from "react";

interface ExpandibleListProps {
  items: string[];
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
}: ExpandibleListProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const namesList = (
    <ul className="mt-5 flex flex-col gap-4">
      {items.map((name, index) => (
        <li key={index}>- {name}</li>
      ))}
    </ul>
  );

  const getSeeMoreText = () => {
    const count = items.length - maxItems;

    return `, and ${count} other ${count > 1 ? noun.plural : noun.singular}`;
  };

  const trigger = (
    <Button variant="link" className="px-0">
      {items.slice(0, maxItems).join(", ")}

      {items.length > maxItems ? getSeeMoreText() : null}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Other {noun.plural}</DialogTitle>
          </DialogHeader>

          {namesList}
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

        <div className="px-4">{namesList}</div>

        <DrawerFooter className="mt-5">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
