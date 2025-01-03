import type { Block } from "@openiti/markdown-parser";
import React from "react";

export default function RenderBlock({ block }: { block: Block }) {
  if (block.type === "verse") {
    return (
      <div className="mx-auto grid max-w-[600px] grid-cols-2 gap-x-4 gap-y-2">
        {block.content.map((hemistich, index) => (
          <p key={index}>{hemistich}</p>
        ))}
      </div>
    );
  }

  if (
    block.type === "title" ||
    (block.type === "header" && block.level === 1)
  ) {
    return <h1>{block.content}</h1>;
  }

  if (block.type === "header" && block.level === 2) {
    return <h2>{block.content}</h2>;
  }

  if (block.type === "header" && block.level === 3) {
    return <h3>{block.content}</h3>;
  }

  if (block.type === "header" && block.level === 4) {
    return <h4>{block.content}</h4>;
  }

  if (block.type === "header" && block.level >= 5) {
    return <h5>{block.content}</h5>;
  }

  if (block.type === "blockquote") {
    return (
      <p className="my-4 text-2xl font-semibold">
        <span className="ml-2">﴿</span>
        {block.content}
        <span className="mr-2">﴾</span>
      </p>
    );
  }

  return <p>{block.content}</p>;
}
