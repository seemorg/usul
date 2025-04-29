import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const alertVariants = cva(
  "[&>svg]:text-foreground relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:top-4 [&>svg]:left-4 [&>svg+div]:translate-y-[-3px] [&>svg~*]:ltr:pl-7 [&>svg~*]:rtl:pr-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        primary: "bg-primary-foreground border-primary text-black",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = ({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants>) => (
  <div
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
);

const AlertTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h5
    className={cn("mb-1 leading-none font-medium tracking-tight", className)}
    {...props}
  />
);

const AlertDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
);

export { Alert, AlertTitle, AlertDescription };
