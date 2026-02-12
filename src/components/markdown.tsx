import ReactMarkdown from "react-markdown";

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  br: () => <br />,
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  a: ({
    href,
    children,
  }: {
    href?: string | null;
    children?: React.ReactNode;
  }) => {
    const url = typeof href === "string" ? href : "#";
    const isExternal = url.startsWith("http");
    return (
      <a
        href={url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="underline underline-offset-2 hover:opacity-80"
      >
        {children}
      </a>
    );
  },
};

export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  // Turn single newlines into Markdown line breaks (two trailing spaces + \n)
  const withLineBreaks = children.replace(/\n/g, "  \n");
  return (
    <span className={className}>
      <ReactMarkdown components={markdownComponents}>
        {withLineBreaks}
      </ReactMarkdown>
    </span>
  );
}
