import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import type { Components } from "react-markdown";
import { memo, useMemo } from "react";
import equal from "fast-deep-equal";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import PageReference from "./page-reference";
import makeSourcesPlugin from "./sources-plugin";

interface MarkdownProps {
  children: string;
  sourceNodes?: SemanticSearchBookNode[];
}

const components: Partial<Components> = {
  pre: ({ children }) => <>{children}</>,
  ol: ({ node: _, children, ...props }) => {
    return (
      <ol className="ml-4 list-outside list-decimal" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node: _, children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node: _, children, ...props }) => {
    return (
      <ul className="ml-4 list-outside list-decimal" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node: _, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node: _, children, ...props }) => {
    return (
      <a
        className="text-primary hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  h1: ({ node: _, children, ...props }) => {
    return (
      <h1 className="mt-6 mb-2 text-3xl font-semibold" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ node: _, children, ...props }) => {
    return (
      <h2 className="mt-6 mb-2 text-2xl font-semibold" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ node: _, children, ...props }) => {
    return (
      <h3 className="mt-6 mb-2 text-xl font-semibold" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node: _, children, ...props }) => {
    return (
      <h4 className="mt-6 mb-2 text-lg font-semibold" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node: _, children, ...props }) => {
    return (
      <h5 className="mt-6 mb-2 text-base font-semibold" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ node: _, children, ...props }) => {
    return (
      <h6 className="mt-6 mb-2 text-sm font-semibold" {...props}>
        {children}
      </h6>
    );
  },
};

const makeComponents = (sourceNodes: SemanticSearchBookNode[]): Components => ({
  "page-reference": (props) => (
    <PageReference sourceNodes={sourceNodes} {...props} />
  ),
  ...components,
});

const rehypePlugins = [rehypeRaw];

const NonMemoizedMarkdown = ({ children, sourceNodes }: MarkdownProps) => {
  const markdownProps = useMemo(() => {
    return {
      plugins: [
        makeSourcesPlugin(
          (sourceNodes ?? []).map((_, idx) => {
            return idx + 1;
          }),
        ),
        remarkGfm,
      ],
      components: makeComponents(sourceNodes ?? []),
    };
  }, [sourceNodes]);

  return (
    <ReactMarkdown
      rehypePlugins={rehypePlugins}
      remarkPlugins={markdownProps.plugins}
      components={markdownProps.components}
      className="flex flex-col gap-3"
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    equal(prevProps.sourceNodes, nextProps.sourceNodes),
);
