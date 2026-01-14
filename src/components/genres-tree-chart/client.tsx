"use client";

import type { GenreNode } from "@/types/genre";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { useRouter } from "@/navigation";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";
import * as d3 from "d3";
import { useTranslations } from "next-intl";

interface GenreTreeChartProps {
  data: GenreNode[];
}

export default function GenreTreeChart({ data }: GenreTreeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const expandedNodesRef = useRef<Set<string>>(new Set());
  const previousRootRef = useRef<any>(null);
  const t = useTranslations("entities");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const direction = useDirection();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    // Initial measurement
    updateDimensions();

    // Watch for resize
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (
      !containerRef.current ||
      dimensions.width === 0 ||
      dimensions.height === 0
    )
      return;

    const width = dimensions.width;
    const height = dimensions.height;
    const isMobile = dimensions.width < 640;

    // Save expanded state from previous root before clearing
    // This ensures we capture the current state even if clicks happened
    if (previousRootRef.current) {
      previousRootRef.current.descendants().forEach((d: any) => {
        if (d.data.slug) {
          if (d.children) {
            expandedNodesRef.current.add(d.data.slug);
          } else {
            expandedNodesRef.current.delete(d.data.slug);
          }
        }
      });
    }

    // Clear previous content
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const combinedRoot = {
      primaryName: t("genres"),
      id: "root",
      children: data,
    };
    const dx = 200;
    const dy = 180;

    const treeLayout = d3.tree().nodeSize([dy, dx]);
    const diagonal = d3
      .linkVertical()
      .x((d: any) => d.x)
      .y((d: any) => d.y);

    const root: any = d3.hierarchy(combinedRoot);
    root.x0 = width / 2;
    root.y0 = height / 2;

    // Restore expanded state
    root.descendants().forEach((d: any, i: number) => {
      d.id = i;
      d._children = d.children;
      // If this node was expanded before, keep it expanded
      if (
        d.depth &&
        d.children &&
        d.data.slug &&
        expandedNodesRef.current.has(d.data.slug)
      ) {
        // Keep children, don't collapse
        d.children = d.children;
      } else if (d.depth && d.children) {
        d.children = null;
      }
    });

    // Store reference for next resize
    previousRootRef.current = root;

    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("style", "width: 100%; height: 100%; cursor: grab;");

    const g = svg.append("g");

    const zoom = d3
      .zoom()
      .scaleExtent([0.3, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
      });

    // Run layout once to get root position for initial centering
    treeLayout(root);

    // Initialize zoom transform to match the starting position
    // This prevents the snap on first drag
    // Center the root node vertically (subtract a bit to account for tree growing downward)
    const initialScale = isMobile ? 0.5 : 1; // Bigger zoom on mobile
    const centerX = isMobile ? width / 1 : width / 2;
    const centerY = isMobile ? height / 2 : height / 2 - 100;
    const initialTransform = d3.zoomIdentity
      .scale(initialScale)
      .translate(
        centerX - initialScale * root.x,
        centerY - initialScale * root.y,
      );

    svg.call(zoom as any);
    // Set the initial transform state directly to avoid snap on first drag
    (svg.node() as any).__zoom = initialTransform;
    g.attr("transform", initialTransform.toString());

    const gLink = g
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#888")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", 1.5);

    const gNode = g.append("g");

    const boxWidth = 150;
    const boxHeight = 100;
    const boxPaddingX = 8;
    const boxPaddingY = 20;

    function wrapText(textSelection: any, width: number) {
      textSelection.each(function (this: SVGTextElement) {
        const text = d3.select(this);
        const raw = (text.attr("data-label") || text.text() || "").trim();
        if (!raw) return;

        const lineHeight = 1.2;
        const y = parseFloat(text.attr("y") || "0");
        let lineNumber = 0;
        text.text(null);

        // Split by newlines first to preserve intentional line breaks
        const lines = raw.split(/\n/);

        lines.forEach((lineText: string) => {
          if (lineText.trim() === "") {
            // Empty line - add spacing
            lineNumber += 1;
            return;
          }

          // Split line into words and wrap within the line
          const words = lineText
            .split(/\s+/)
            .filter((w: string) => w.length > 0);

          if (words.length === 0) return;

          // For RTL languages, don't reverse words
          // For LTR languages, reverse to use pop() efficiently
          const isRTL = direction === "rtl";
          const wordsToProcess = isRTL ? words : [...words].reverse();

          let word;
          let line: string[] = [];
          let tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", `${lineNumber * lineHeight}em`)
            .attr("direction", direction)
            .style("unicode-bidi", isRTL ? "bidi-override" : "plaintext");

          if (isRTL) {
            // For RTL: process words in order
            for (const w of wordsToProcess) {
              line.push(w);
              tspan.text(line.join(" "));
              if (tspan.node()!.getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [w];
                lineNumber += 1;
                tspan = text
                  .append("tspan")
                  .attr("x", 0)
                  .attr("y", y)
                  .attr("dy", `${lineNumber * lineHeight}em`)
                  .attr("direction", direction)
                  .style("unicode-bidi", isRTL ? "bidi-override" : "plaintext")
                  .text(w);
              }
            }
          } else {
            // For LTR: use pop() with reversed array
            while ((word = wordsToProcess.pop())) {
              line.push(word);
              tspan.text(line.join(" "));
              if (tspan.node()!.getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                lineNumber += 1;
                tspan = text
                  .append("tspan")
                  .attr("x", 0)
                  .attr("y", y)
                  .attr("dy", `${lineNumber * lineHeight}em`)
                  .attr("direction", direction)
                  .style("unicode-bidi", isRTL ? "bidi-override" : "plaintext")
                  .text(word);
              }
            }
          }

          lineNumber += 1;
        });
      });
    }

    function wrapAndResizeText(
      textSelection: any,
      width: number,
      maxHeight: number,
      baseFontSize: number,
      minFontSize: number,
    ) {
      textSelection.each(function (this: SVGTextElement) {
        const text = d3.select(this);
        const rawText = (text.attr("data-label") || text.text() || "").trim();
        if (!rawText) {
          text.text("");
          return;
        }

        let fontSize = baseFontSize;
        let fits = false;

        while (!fits && fontSize >= minFontSize) {
          text.attr("font-size", fontSize);
          wrapText(text, width);
          const bbox = this.getBBox();
          if (bbox.height <= maxHeight) {
            fits = true;
          } else {
            fontSize -= 1;
          }
        }

        if (!fits) {
          text.attr("font-size", minFontSize);
          wrapText(text, width);
        }
      });
    }

    function update(source: any) {
      treeLayout(root);
      const nodes = root.descendants();
      const links = root.links();

      // LINKS
      const link = gLink.selectAll("path").data(links, (d: any) => d.target.id);
      link.join(
        (enter) =>
          enter
            .append("path")
            .attr("d", (d: any) => {
              const o = { x: source.x0, y: source.y0 };
              return (diagonal as any)({ source: o, target: o });
            })
            .call((enter) =>
              enter
                .transition()
                .duration(500)
                .attr("d", diagonal as any),
            ),
        (update) =>
          update
            .transition()
            .duration(500)
            .attr("d", diagonal as any),
        (exit) =>
          exit
            .transition()
            .duration(500)
            .attr("d", (d: any) => {
              const o = { x: source.x, y: source.y };
              return (diagonal as any)({ source: o, target: o });
            })
            .remove(),
      );

      // NODES
      const node = gNode.selectAll("g.node").data(nodes, (d: any) => d.id);

      // ENTER
      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d: any) => `translate(${source.x0},${source.y0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      // Add click area (larger than visible rect for better UX)
      nodeEnter
        .append("rect")
        .attr("class", "click-area")
        .attr("x", -boxWidth / 2)
        .attr("y", -boxHeight / 2)
        .attr("width", boxWidth)
        .attr("height", boxHeight)
        .attr("fill", "transparent")
        .style("cursor", "pointer")
        .on("click", (event: any, d: any) => {
          d.children = d.children ? null : d._children;
          // Update expanded state tracking
          if (d.data.slug) {
            if (d.children) {
              expandedNodesRef.current.add(d.data.slug);
            } else {
              expandedNodesRef.current.delete(d.data.slug);
            }
          }
          update(d);
        });

      // Box
      nodeEnter
        .append("rect")
        .attr("class", "node-rect")
        .attr("x", -boxWidth / 2)
        .attr("y", -boxHeight / 2)
        .attr("width", boxWidth)
        .attr("height", boxHeight)
        .attr("rx", 8)
        .attr("fill", "var(--color-card)")
        .attr("stroke-width", 2)
        .style("pointer-events", "none");

      // Text
      nodeEnter
        .append("text")
        .attr("class", "node-text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "hanging")
        .attr("fill", "var(--color-foreground)")
        .attr("font-family", "var(--font-sans)")
        .attr("x", 0)
        .attr("y", -boxHeight / 2 + boxPaddingY)
        .attr("data-label", (d: any) => {
          const primary = (d.data.primaryName || "").trim();
          const secondary = (d.data.secondaryName || "").trim();
          if (secondary) {
            return `${primary}\n\n${secondary}`;
          }
          return primary;
        })
        .text((d: any) => {
          const primary = (d.data.primaryName || "").trim();
          const secondary = (d.data.secondaryName || "").trim();
          if (secondary) {
            return `${primary}\n${secondary}`;
          }
          return primary;
        })
        .style("pointer-events", "none")
        .attr("direction", direction)
        .style(
          "unicode-bidi",
          direction === "rtl" ? "bidi-override" : "plaintext",
        )
        .call((selection: any) =>
          wrapAndResizeText(
            selection,
            boxWidth - boxPaddingX * 2,
            boxHeight - boxPaddingY * 2,
            14,
            6,
          ),
        );

      // Book count tag
      const bookCountTag = nodeEnter
        .append("g")
        .attr("class", "book-count-tag")
        .style("pointer-events", "none");

      bookCountTag
        .append("rect")
        .attr("y", boxHeight / 2 - 17)
        .attr("height", 14)
        .attr("rx", 4)
        .attr("fill", "var(--color-primary)")
        .attr("opacity", 0.1)
        .attr("stroke", "var(--color-primary)")
        .attr("stroke-width", 1);

      bookCountTag
        .append("text")
        .attr("y", boxHeight / 2 - 8)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "var(--color-primary)")
        .attr("font-family", "var(--font-sans)")
        .attr("font-size", "8")
        .attr("font-weight", "600");

      // View tag
      const viewTag = nodeEnter
        .append("g")
        .attr("class", "view-tag")
        .style("cursor", "pointer");

      viewTag
        .append("rect")
        .attr("y", boxHeight / 2 - 17)
        .attr("height", 14)
        .attr("rx", 4)
        .attr("fill", "var(--color-primary)")
        .attr("opacity", 0.1)
        .attr("stroke", "var(--color-primary)")
        .attr("stroke-width", 1)
        .on("click", (event: any, d: any) => {
          event.stopPropagation();
          if (d.data.slug && d.data.slug !== "root") {
            router.push(navigation.genres.bySlug(d.data.slug));
          }
        });

      viewTag
        .append("text")
        .attr("y", boxHeight / 2 - 8)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "var(--color-primary)")
        .attr("font-family", "var(--font-sans)")
        .attr("font-size", "8")
        .attr("font-weight", "600")
        .on("click", (event: any, d: any) => {
          event.stopPropagation();
          if (d.data.slug && d.data.slug !== "root") {
            router.push(navigation.genres.bySlug(d.data.slug));
          }
        });

      // UPDATE (merge enter + update)
      const nodeUpdate = nodeEnter.merge(node as any);

      // Update stroke on rect based on _children state
      nodeUpdate
        .select(".node-rect")
        .attr("stroke", (d: any) =>
          d._children ? "var(--color-primary)" : "var(--color-border)",
        )
        .attr("stroke-width", (d: any) => (d._children ? 3 : 2));

      // Update text wrapping
      nodeUpdate
        .select(".node-text")
        .call((selection: any) =>
          wrapAndResizeText(
            selection,
            boxWidth - boxPaddingX * 2,
            boxHeight - boxPaddingY * 2,
            14,
            6,
          ),
        );

      // Update book count tag
      nodeUpdate.each(function (this: SVGGElement, d: any) {
        const nodeGroup = d3.select(this);
        const count = d.data.numberOfBooks ?? 0;
        const hasBooks = count > 0;
        const bookText = t("x-texts", { count });
        const bookTagWidth = Math.max(50, bookText.length * 6 + 12);

        const hasViewTag = hasBooks && d.data.slug && d.data.slug !== "root";
        const viewText = tCommon("view");
        const viewTagWidth = hasViewTag
          ? Math.max(40, viewText.length * 6 + 12)
          : 0;
        const gap = hasViewTag ? 6 : 0;
        const totalWidth = bookTagWidth + gap + viewTagWidth;

        // Update book count
        const bookCountTag = nodeGroup.select(".book-count-tag");
        if (hasBooks) {
          bookCountTag
            .select("rect")
            .attr("width", bookTagWidth)
            .attr("x", -totalWidth / 2)
            .style("display", "block");

          bookCountTag
            .select("text")
            .attr("x", -totalWidth / 2 + bookTagWidth / 2)
            .text(bookText)
            .style("display", "block");
        } else {
          bookCountTag.select("rect").style("display", "none");
          bookCountTag.select("text").style("display", "none");
        }

        // Update view tag
        const viewTag = nodeGroup.select(".view-tag");
        if (hasViewTag) {
          viewTag
            .select("rect")
            .attr("width", viewTagWidth)
            .attr("x", -totalWidth / 2 + bookTagWidth + gap)
            .style("display", "block");

          viewTag
            .select("text")
            .attr("x", -totalWidth / 2 + bookTagWidth + gap + viewTagWidth / 2)
            .text(viewText)
            .style("display", "block");
        } else {
          viewTag.select("rect").style("display", "none");
          viewTag.select("text").style("display", "none");
        }
      });

      // Transition to final position
      nodeUpdate
        .transition()
        .duration(500)
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      // EXIT
      node
        .exit()
        .transition()
        .duration(500)
        .attr("transform", (d: any) => `translate(${source.x},${source.y})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .remove();

      root.eachBefore((d: any) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    update(root);
    if (containerRef.current) {
      containerRef.current.appendChild(svg.node() as Node);
    }

    // Force initial text wrapping after DOM is ready
    setTimeout(() => {
      gNode
        .selectAll(".node-text")
        .call((selection: any) =>
          wrapAndResizeText(
            selection,
            boxWidth - boxPaddingX * 2,
            boxHeight - boxPaddingY * 2,
            14,
            6,
          ),
        );
    }, 0);
  }, [
    data,
    t,
    tCommon,
    router,
    dimensions.width,
    dimensions.height,
    direction,
  ]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // ResizeObserver will automatically detect the size change
      // No need to manually update dimensions here
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!chartContainerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await chartContainerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  return (
    <div
      ref={chartContainerRef}
      className="bg-card relative mb-16 flex h-[300px] w-full items-center justify-center overflow-hidden rounded-lg border sm:h-[500px]"
    >
      <div ref={containerRef} className="h-full w-full overflow-hidden" />
      <Button
        size="icon"
        variant="outline"
        className="absolute right-4 bottom-4 z-10 hidden backdrop-blur-sm sm:flex"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? (
          <ArrowsPointingInIcon className="h-5 w-5" />
        ) : (
          <ArrowsPointingOutIcon className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
