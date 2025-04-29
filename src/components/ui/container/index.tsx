import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

const Container = ({ className, ...props }: ContainerProps) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-5xl px-4 py-2 2xl:max-w-6xl",
        className,
      )}
      {...props}
    />
  );
};

export default Container;
