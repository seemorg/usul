"use client";

import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Dialog as SheetPrimitive } from "radix-ui";
import { cva } from "class-variance-authority";
import { XIcon } from "lucide-react";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = ({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) => (
  <SheetPrimitive.Overlay
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
      className,
    )}
    {...props}
  />
);

const sheetVariants = cva(
  "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b",
        bottom:
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t",
        left: "data-[state=closed]:ltr:slide-out-to-left data-[state=open]:ltr:slide-in-from-left data-[state=closed]:rtl:slide-out-to-right data-[state=open]:rtl:slide-in-from-right inset-y-0 h-full w-3/4 border-r sm:max-w-sm ltr:left-0 rtl:right-0",
        right:
          "data-[state=closed]:ltr:slide-out-to-right data-[state=open]:ltr:slide-in-from-right data-[state=closed]:rtl:slide-out-to-left data-[state=open]:rtl:slide-in-from-left inset-y-0 h-full w-3/4 border-l sm:max-w-sm ltr:right-0 rtl:left-0",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends React.ComponentProps<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = ({
  side = "right",
  className,
  children,
  ...props
}: SheetContentProps) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none ltr:left-4 rtl:right-4">
        <XIcon className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
);

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) => (
  <SheetPrimitive.Title
    className={cn("text-foreground text-lg font-semibold", className)}
    {...props}
  />
);

const SheetDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) => (
  <SheetPrimitive.Description
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
);

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
