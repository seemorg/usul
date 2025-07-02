import type { SemanticSearchBookNode } from "@/types/SemanticSearchBookNode";
import type { Components } from "react-markdown";
import { memo, useMemo } from "react";
import equal from "fast-deep-equal";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import AdditionalSourcesHover from "./additional-sources-hover";
import PageReference from "./page-reference";
import makeSourcesPlugin from "./sources-plugin";

interface MarkdownProps {
  children: string;
  sourceNodes?: SemanticSearchBookNode[];
}

const makeComponents = (sourceNodes: SemanticSearchBookNode[]): Components => ({
  "page-reference": (props) => (
    <PageReference sourceNodes={sourceNodes} {...props} />
  ),
  "additional-sources-hover": (props) => {
    const sourcesData = (props as { "data-sources": string })["data-sources"];
    if (sourcesData) {
      try {
        const additionalSources = sourcesData.split(",").map(Number);
        return (
          <AdditionalSourcesHover
            additionalSources={additionalSources}
            sourceNodes={sourceNodes}
          />
        );
      } catch (error) {
        return null;
      }
    }
    return null;
  },
  ol: (props) => <ol className="flex flex-col gap-2" {...props} />,
  ul: (props) => <ul className="flex flex-col gap-2" {...props} />,
});

const NonMemoizedMarkdown = ({ children, sourceNodes }: MarkdownProps) => {
  const markdownProps = useMemo(() => {
    return {
      plugin: makeSourcesPlugin(
        (sourceNodes ?? []).map((_, idx) => {
          return idx + 1;
        }),
      ),
      components: makeComponents(sourceNodes ?? []),
    };
  }, [sourceNodes]);

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[markdownProps.plugin]}
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
