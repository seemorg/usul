import type { Node } from "unist";
import { SKIP, visit } from "unist-util-visit";

function makeSourcesPlugin(numbers: number[]) {
  return () => {
    return (tree: Node) => {
      visit(tree, "text", (node, index, parent) => {
        const value = (node as any).value;

        const regex = /\[(\d+)\]/g;
        let match;
        let lastIndex = 0;
        const newNodes = [];
        let consecutiveRefs: number[] = [];
        let lastRefEnd = 0;

        while ((match = regex.exec(value)) !== null) {
          const number = match[1];
          const parsedNumber = Number(number);
          if (!numbers.includes(parsedNumber)) {
            continue;
          }

          const start = match.index;

          // Check if this is a consecutive reference (close to the previous one)
          const isConsecutive =
            consecutiveRefs.length > 0 && start - lastRefEnd <= 3; // Allow for small gaps like spaces

          if (isConsecutive) {
            consecutiveRefs.push(parsedNumber);
          } else {
            // Process previous consecutive group if exists
            if (consecutiveRefs.length > 0) {
              newNodes.push(...processConsecutiveRefs(consecutiveRefs));
            }

            // Add text before this reference
            if (start > lastIndex) {
              newNodes.push({
                type: "text",
                value: value.slice(lastIndex, start),
              });
            }

            consecutiveRefs = [parsedNumber];
          }

          lastRefEnd = regex.lastIndex;
          lastIndex = regex.lastIndex;
        }

        // Process final consecutive group
        if (consecutiveRefs.length > 0) {
          newNodes.push(...processConsecutiveRefs(consecutiveRefs));
        }

        if (lastIndex < value.length) {
          newNodes.push({
            type: "text",
            value: value.slice(lastIndex),
          });
        }

        if (newNodes.length > 0) {
          if (parent) {
            (parent as any).children.splice(index, 1, ...newNodes);
          }
          return [SKIP, index + newNodes.length];
        }
      });
    };
  };
}

function processConsecutiveRefs(refs: number[]) {
  const nodes: any[] = [];

  if (refs.length <= 2) {
    // Show all references as individual elements
    refs.forEach((ref) => {
      nodes.push({
        type: "html",
        value: `<page-reference data-number="${ref}"></page-reference>`,
      });
    });
  } else {
    // Show first 2 references as individual elements + indicator with hover card
    nodes.push({
      type: "html",
      value: `<page-reference data-number="${refs[0]}"></page-reference>`,
    });
    nodes.push({
      type: "html",
      value: `<page-reference data-number="${refs[1]}"></page-reference>`,
    });

    // Create hover card for additional sources
    const additionalSources = refs.slice(2);
    nodes.push({
      type: "html",
      value: `<additional-sources-hover data-sources='${additionalSources.join(",")}'></additional-sources-hover>`,
    });
  }

  return nodes;
}

export default makeSourcesPlugin;
