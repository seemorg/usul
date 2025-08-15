import type { MDXComponents } from "mdx/types";

import { Link } from "./navigation";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: (props: React.ComponentProps<"a">) =>
      props.href?.startsWith("http") ? (
        <a {...props} target="_blank" />
      ) : (
        // @ts-expect-error - idk
        <Link {...props} />
      ),
  };
}
