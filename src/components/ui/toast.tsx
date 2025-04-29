"use client";

import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Toast as ToastPrimitive } from "radix-ui";
import { cva } from "class-variance-authority";
import { XIcon } from "lucide-react";

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport>) => (
  <ToastPrimitive.Viewport
    className={cn(
      "fixed top-0 z-9999999999 flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:bottom-0 sm:left-0 sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
);

const toastVariants = cva(
  "group data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-left-full data-[state=open]:slide-in-from-top-full sm:data-[state=open]:slide-in-from-bottom-full pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
  {
    variants: {
      variant: {
        primary: "primary group bg-primary border text-white",
        secondary: "bg-background text-foreground border",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

const Toast = ({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Root> &
  VariantProps<typeof toastVariants>) => (
  <ToastPrimitive.Root
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
);

const ToastAction = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Action>) => (
  <ToastPrimitive.Action
    className={cn(
      "hover:bg-secondary focus:ring-ring group-[.destructive]:border-muted/40 hover:group-[.destructive]:border-destructive/30 hover:group-[.destructive]:bg-destructive hover:group-[.destructive]:text-destructive-foreground focus:group-[.destructive]:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:ring-1 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
);

const ToastClose = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Close>) => (
  <ToastPrimitive.Close
    className={cn(
      "text-foreground/50 hover:text-foreground absolute top-1 right-1 rounded-md p-1 focus:ring-1 focus:outline-hidden",
      "group-[.destructive]:text-red-300 hover:group-[.destructive]:text-red-50 focus:group-[.destructive]:ring-red-400 focus:group-[.destructive]:ring-offset-red-600",
      "group-[.primary]:text-white hover:group-[.primary]:text-white/70",
      className,
    )}
    toast-close=""
    {...props}
  >
    <XIcon className="h-4 w-4" />
  </ToastPrimitive.Close>
);

const ToastTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Title>) => (
  <ToastPrimitive.Title
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
);

const ToastDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description>) => (
  <ToastPrimitive.Description
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
);

type ToastProps = React.ComponentProps<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
