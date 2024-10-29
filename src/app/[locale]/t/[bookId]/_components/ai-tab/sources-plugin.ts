import visit from "unist-util-visit";
import type { Node, Data } from "unist";

function makeSourcesPlugin(numbers: number[]) {
  return () => {
    return (tree: Node<Data>) => {
      visit(tree, "text", (node, index, parent) => {
        const value = (node as any).value;

        const regex = /\[(\d+)\]/g;
        let match;
        let lastIndex = 0;
        const newNodes = [];

        while ((match = regex.exec(value)) !== null) {
          const number = match[1];
          const parsedNumber = Number(number);
          if (!numbers.includes(parsedNumber)) {
            continue;
          }

          const start = match.index;
          if (start > lastIndex) {
            newNodes.push({
              type: "text",
              value: value.slice(lastIndex, start),
            });
          }

          newNodes.push({
            type: "html",
            value: `<page-reference data-number="${number}" />`,
          });

          lastIndex = regex.lastIndex;
        }

        if (lastIndex < value.length) {
          newNodes.push({
            type: "text",
            value: value.slice(lastIndex),
          });
        }

        if (newNodes.length > 0) {
          if (parent) {
            parent.children.splice(index, 1, ...newNodes);
          }
          return [visit.SKIP, index + newNodes.length];
        }
      });
    };
  };
}

export default makeSourcesPlugin;
