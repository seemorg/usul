import type { Block } from "@openiti/markdown-parser";
import React from "react";

export default function RenderBlock({ block }: { block: Block }) {
  if (block.type === "verse") {
    return (
      <div className="flex gap-8">
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
    return <h1 className="text-3xl font-bold">{block.content}</h1>;
  }

  if (block.type === "header" && block.level === 2) {
    return <h2 className="text-2xl font-bold">{block.content}</h2>;
  }

  if (block.type === "header" && block.level === 3) {
    return <h3 className="text-xl font-semibold">{block.content}</h3>;
  }

  if (block.type === "header" && block.level === 4) {
    return <h4 className="text-xl font-semibold">{block.content}</h4>;
  }

  if (block.type === "header" && block.level >= 5) {
    return <h5 className="text-xl font-medium">{block.content}</h5>;
  }

  if (block.type === "blockquote") {
    return (
      <blockquote className="border-r-[0.25rem] border-primary/30 p-3 text-xl font-semibold italic">
        {block.content}
      </blockquote>
    );
  }

  return <p className="text-2xl leading-[2.3]">{block.content}</p>;
}
