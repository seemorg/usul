"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { navigation } from "@/lib/urls";
import { useRouter } from "@/navigation";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import * as d3 from "d3";

import { regionToCountryCode } from "./regions-to-country-codes";

interface RegionData {
  id: string;
  slug: string;
  name: string;
  secondaryName: string;
  currentName?: string;
  overview?: string;
  numberOfAuthors: number;
  numberOfBooks: number;
}

interface RegionsChoroplethMapProps {
  data: RegionData[];
}

export default function RegionsChoroplethMap({
  data,
}: RegionsChoroplethMapProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const isMountedRef = useRef(true);
  const router = useRouter();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if data is available
  const isDataReady = data && Array.isArray(data) && data.length > 0;

  // Set up dimensions observer
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const updateDimensions = () => {
      if (chartContainerRef.current) {
        const rect = chartContainerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: Math.max(rect.height, 500),
        });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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

  // Create the map
  useEffect(() => {
    // Don't proceed if data is not ready or dimensions are not set
    if (!isDataReady || dimensions.width === 0 || !chartContainerRef.current) {
      return;
    }

    // Wait for containerRef to be available (it's conditionally rendered)
    if (!containerRef.current) {
      return;
    }

    isMountedRef.current = true;

    const width = dimensions.width;
    const isMobile = width < 768;
    const height = dimensions.height;

    // Clear previous content safely
    if (containerRef.current) {
      // Remove existing SVG if it exists and is still a child
      if (svgRef.current && containerRef.current.contains(svgRef.current)) {
        containerRef.current.removeChild(svgRef.current);
      }
      svgRef.current = null;
    }

    // Create data map from region data
    const dataMap = new Map<string, RegionData>();
    data.forEach((region) => {
      const countryCodes = regionToCountryCode[region.slug] || [];
      countryCodes.forEach((code) => {
        // If multiple regions map to same country, use the one with more books
        const existing = dataMap.get(code);
        if (!existing || region.numberOfBooks > existing.numberOfBooks) {
          dataMap.set(code, region);
        }
      });
    });

    // Create SVG
    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr(
        "style",
        "width: 100%; height: 100%; cursor: grab; touch-action: none;",
      );

    const g = svg.append("g");

    // Projection
    const initialScale = isMobile ? width / 3 : width / 6.5;
    const projection = d3
      .geoMercator()
      .scale(initialScale)
      .center([0, isMobile ? 10 : 20])
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Track current projection state for zoom-to-cursor
    let currentScale = initialScale;
    let currentTranslate: [number, number] = [width / 2, height / 2];
    let lastPanPoint: [number, number] | null = null;
    let touchStartPoint: [number, number] | null = null;
    let hasPanned = false;

    // Zoom behavior with zoom-to-cursor
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8]) // Allow zoom from 0.5x to 8x
      .filter((event) => {
        // Allow wheel events for zooming
        if (event.type === "wheel") return false;
        // Allow left mouse button for panning
        if (event.type === "mousedown" && (event as MouseEvent).button === 0)
          return true;
        // Allow touch events for mobile
        if (event.type === "touchstart" || event.type === "touchmove")
          return true;
        return false;
      })
      .on("start", (event) => {
        svg.style("cursor", "grabbing");
        // Prevent default on touch events to avoid scrolling
        if (event.sourceEvent && "touches" in event.sourceEvent) {
          event.sourceEvent.preventDefault();
          return;
        }
        try {
          const svgNode = svg.node();
          if (!svgNode) return;
          const mousePos = d3.pointer(event, svgNode);
          if (mousePos && isFinite(mousePos[0]) && isFinite(mousePos[1])) {
            lastPanPoint = [mousePos[0], mousePos[1]];
            touchStartPoint = [mousePos[0], mousePos[1]];
            hasPanned = false;
          }
        } catch (error) {
          // Silently handle pointer errors (can happen during programmatic zoom)
          // console.debug("Error getting pointer position:", error);
        }
      })
      .on("zoom", (event) => {
        const { transform } = event;

        // Safely get mouse position
        let mousePos: [number, number] | null = null;
        try {
          const svgNode = svg.node();
          if (svgNode) {
            const pos = d3.pointer(event, svgNode);
            if (pos && isFinite(pos[0]) && isFinite(pos[1])) {
              mousePos = [pos[0], pos[1]];
            }
          }
        } catch (error) {
          // Silently handle pointer errors (can happen during programmatic zoom)
          // console.debug("Error getting pointer position:", error);
        }

        // Update scale and translation from transform
        currentScale = initialScale * transform.k;
        currentTranslate = [width / 2 + transform.x, height / 2 + transform.y];

        // Pan operation - track mouse movement for hasPanned flag (only if mouse position is available)
        if (mousePos && lastPanPoint) {
          const [mouseX, mouseY] = mousePos;
          const dx = mouseX - lastPanPoint[0];
          const dy = mouseY - lastPanPoint[1];

          // Mark that we've panned if movement is significant
          if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
            hasPanned = true;
          }

          lastPanPoint = [mouseX, mouseY];
        }

        // Update projection with new scale and translation
        projection.scale(currentScale).translate(currentTranslate);

        // Redraw all paths with new projection
        g.selectAll<SVGPathElement, GeoJSON.Feature>("path").attr("d", (d) =>
          path(d),
        );
      })
      .on("end", () => {
        svg.style("cursor", "grab");
        lastPanPoint = null;
        // Reset after a short delay to allow click handler to check hasPanned
        setTimeout(() => {
          touchStartPoint = null;
          hasPanned = false;
        }, 100);
      });

    // Store zoom behavior in ref for button handlers
    zoomRef.current = zoom;

    // Apply zoom to SVG
    (svg as any).call(zoom);

    // Color scale based on numberOfBooks
    // Range from 1 to 1000, with 1000+ getting the max color
    const colorScale = d3
      .scaleThreshold<number, string>()
      .domain([15, 50, 100, 500, 750, 900, 1000])
      .range([
        "#e0f2f1",
        "#b2dfdb",
        "#80cbc4",
        "#4db6ac",
        "#26a69a",
        "#00897b",
        "#00695c",
        "#206e6e", // Max color for 1000+
      ]);

    // Remove existing tooltip if present
    if (
      tooltipRef.current &&
      chartContainerRef.current?.contains(tooltipRef.current)
    ) {
      tooltipRef.current.remove();
    }
    tooltipRef.current = null;

    // Load and draw map
    setIsLoading(true);
    d3.json<GeoJSON.FeatureCollection>(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
    )
      .then((topo) => {
        if (!topo || !chartContainerRef.current) return;

        // Create tooltip inside the promise to ensure it's accessible
        // Append to chartContainerRef so it works in fullscreen mode
        const tooltip = d3
          .select(chartContainerRef.current)
          .append("div")
          .attr("class", "tooltip")
          .style("position", "fixed")
          .style("padding", "8px 12px")
          .style("background", "rgba(0, 0, 0, 0.9)")
          .style("color", "white")
          .style("border-radius", "6px")
          .style("font-size", "13px")
          .style("font-weight", "500")
          .style("pointer-events", "none")
          .style("opacity", 0)
          .style("display", "block")
          .style("z-index", "99999")
          .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)")
          .style("line-height", "1.5")
          .style("max-width", "300px");

        tooltipRef.current = tooltip.node() as HTMLDivElement;

        // Helper function to get coordinates from event (works for both mouse and touch)
        const getEventCoordinates = (
          event: MouseEvent | TouchEvent,
        ): { x: number; y: number } => {
          if (
            "touches" in event &&
            event.touches.length > 0 &&
            event.touches[0]
          ) {
            return { x: event.touches[0].clientX, y: event.touches[0].clientY };
          }
          return {
            x: (event as MouseEvent).clientX,
            y: (event as MouseEvent).clientY,
          };
        };

        // Helper function to show tooltip
        const showTooltip = function (event: MouseEvent | TouchEvent, d: any) {
          const coords = getEventCoordinates(event);

          d3.select(event.currentTarget as SVGPathElement)
            .transition()
            .duration(100)
            .style("stroke", "#000")
            .style("stroke-width", 2);

          // Try different property names for country code
          const countryCode =
            d.properties?.ISO_A3 ||
            d.properties?.ISO_A2 ||
            d.properties?.ADM0_A3 ||
            d.properties?.NAME ||
            d.id;

          const regionData = countryCode ? dataMap.get(countryCode) : null;

          // Always show tooltip with book count
          const countryName =
            regionData?.name || d.properties?.NAME || countryCode || "Unknown";
          const booksCount = regionData?.numberOfBooks ?? 0;
          const authorsCount = regionData?.numberOfAuthors ?? 0;

          let tooltipContent = `<strong>${countryName}</strong><br/>`;
          tooltipContent += `Books: ${booksCount.toLocaleString()}`;
          if (authorsCount > 0) {
            tooltipContent += `<br/>Authors: ${authorsCount.toLocaleString()}`;
          }

          // Position and show tooltip - use clientX/clientY for fixed positioning
          const x = coords.x + 40;
          const y = coords.y - 0;

          // Ensure tooltip is visible
          tooltip
            .style("left", `${x}px`)
            .style("top", `${y}px`)
            .style("opacity", 1)
            .style("visibility", "visible")
            .style("display", "block")
            .html(tooltipContent);

          // Force a reflow to ensure styles are applied
          tooltip.node()?.offsetHeight;

          tooltip.transition().duration(200).style("opacity", 1);
        };

        // Mouse over handler
        const mouseOver = function (event: MouseEvent, d: any) {
          showTooltip(event, d);
        };

        // Touch start handler (for mobile)
        const touchStart = function (event: TouchEvent, d: any) {
          // Prevent default to avoid scrolling
          event.preventDefault();
          showTooltip(event, d);
          // Track touch start point for tap detection
          const coords = getEventCoordinates(event);
          touchStartPoint = [coords.x, coords.y];
          hasPanned = false;
        };

        // Mouse leave handler
        const mouseLeave = function (event: MouseEvent) {
          d3.select(event.currentTarget as SVGPathElement)
            .transition()
            .duration(200)
            .style("stroke", "transparent")
            .style("stroke-width", 1);

          tooltip.transition().duration(200).style("opacity", 0);
        };

        // Touch end handler (for mobile)
        const touchEnd = function (event: TouchEvent, d: any) {
          d3.select(event.currentTarget as SVGPathElement)
            .transition()
            .duration(200)
            .style("stroke", "transparent")
            .style("stroke-width", 1);

          // Navigate on tap (if not panned)
          // Use changedTouches for touchend events
          const startPoint = touchStartPoint;
          if (!hasPanned && startPoint) {
            let endX: number, endY: number;
            const changedTouch = event.changedTouches?.[0];
            if (changedTouch) {
              endX = changedTouch.clientX;
              endY = changedTouch.clientY;
            } else {
              // Fallback if changedTouches is not available
              endX = startPoint[0];
              endY = startPoint[1];
            }

            const dx = Math.abs(endX - startPoint[0]);
            const dy = Math.abs(endY - startPoint[1]);

            // If movement was small (tap, not drag), navigate
            if (dx < 5 && dy < 5) {
              // Try different property names for country code
              const countryCode =
                d.properties?.ISO_A3 ||
                d.properties?.ISO_A2 ||
                d.properties?.ADM0_A3 ||
                d.properties?.NAME ||
                d.id;

              const regionData = countryCode ? dataMap.get(countryCode) : null;

              // Only navigate if we have region data with a slug and books
              if (regionData?.slug && regionData.numberOfBooks > 0) {
                router.push(navigation.regions.bySlug(regionData.slug));
              }
            }
          }

          // Hide tooltip after a delay on mobile to allow reading
          setTimeout(() => {
            tooltip.transition().duration(200).style("opacity", 0);
          }, 2000);
        };

        // Mouse move handler for tooltip
        const mouseMove = function (event: MouseEvent) {
          if (tooltipRef.current) {
            const coords = getEventCoordinates(event);
            tooltip
              .style("left", `${coords.x + 40}px`)
              .style("top", `${coords.y - 0}px`);
          }
        };

        // Touch move handler for tooltip
        const touchMove = function (event: TouchEvent) {
          if (tooltipRef.current && event.touches.length > 0) {
            const coords = getEventCoordinates(event);
            tooltip
              .style("left", `${coords.x + 40}px`)
              .style("top", `${coords.y - 0}px`);
          }
        };

        // Click handler for navigation
        const handleClick = function (event: MouseEvent, d: any) {
          // Prevent navigation if user was panning/zooming
          if (event.defaultPrevented || hasPanned) return;

          // Try different property names for country code
          const countryCode =
            d.properties?.ISO_A3 ||
            d.properties?.ISO_A2 ||
            d.properties?.ADM0_A3 ||
            d.properties?.NAME ||
            d.id;

          const regionData = countryCode ? dataMap.get(countryCode) : null;

          // Only navigate if we have region data with a slug and books
          if (regionData?.slug && regionData.numberOfBooks > 0) {
            router.push(navigation.regions.bySlug(regionData.slug));
          }
        };

        // Draw the map - render ALL countries from GeoJSON
        g.selectAll("path")
          .data(topo.features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("fill", (d: any) => {
            // Try different property names for country code
            const countryCode =
              d.properties?.ISO_A3 ||
              d.properties?.ISO_A2 ||
              d.properties?.ADM0_A3 ||
              d.properties?.NAME ||
              d.id;
            const regionData = countryCode ? dataMap.get(countryCode) : null;
            // Don't highlight countries with 0 books
            if (!regionData || regionData.numberOfBooks === 0) {
              return "#e0e0e0";
            }
            // Clamp values >= 1000 to 1000 for consistent max color
            const booksCount = Math.min(regionData.numberOfBooks, 1000);
            return colorScale(booksCount);
          })
          .attr("data-country-code", (d: any) => {
            // Store country code as data attribute for debugging
            return (
              d.properties?.ISO_A3 ||
              d.properties?.ISO_A2 ||
              d.properties?.ADM0_A3 ||
              d.properties?.NAME ||
              d.id ||
              ""
            );
          })
          .style("stroke", "transparent")
          .style("stroke-width", 1)
          .attr("class", "country")
          .style("opacity", 0.8)
          .style("cursor", "pointer")
          .on("mouseover", mouseOver)
          .on("mouseleave", mouseLeave)
          .on("mousemove", mouseMove)
          .on("click", handleClick)
          .on("touchstart", touchStart)
          .on("touchend", touchEnd)
          .on("touchmove", touchMove);

        if (!isMountedRef.current || !containerRef.current) return;

        const svgNode = svg.node();
        if (svgNode && containerRef.current) {
          containerRef.current.appendChild(svgNode);
          svgRef.current = svgNode;
        }
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error loading map data:", error);
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      });

    return () => {
      isMountedRef.current = false;

      // Clean up tooltip
      if (
        tooltipRef.current &&
        chartContainerRef.current?.contains(tooltipRef.current)
      ) {
        tooltipRef.current.remove();
      }
      tooltipRef.current = null;

      // Clean up SVG
      if (svgRef.current && containerRef.current?.contains(svgRef.current)) {
        containerRef.current.removeChild(svgRef.current);
      }
      svgRef.current = null;

      // Clean up zoom ref
      zoomRef.current = null;
    };
  }, [data, dimensions, isDataReady]);

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

  const handleZoomIn = () => {
    if (!zoomRef.current || !svgRef.current) return;
    const svgSelection = d3.select(svgRef.current);
    const center: [number, number] = [
      dimensions.width / 2,
      dimensions.height / 2,
    ];
    zoomRef.current.scaleBy(svgSelection, 1.5, center);
  };

  const handleZoomOut = () => {
    if (!zoomRef.current || !svgRef.current) return;
    const svgSelection = d3.select(svgRef.current);
    const center: [number, number] = [
      dimensions.width / 2,
      dimensions.height / 2,
    ];
    zoomRef.current.scaleBy(svgSelection, 1 / 1.5, center);
  };

  return (
    <div
      ref={chartContainerRef}
      className="bg-card relative mb-16 flex h-[300px] w-full items-center justify-center overflow-hidden rounded-lg border sm:h-[500px]"
      style={{ touchAction: "none" }}
    >
      {!isDataReady && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      )}
      {isLoading && isDataReady && (
        <div className="bg-card/50 absolute inset-0 z-10 flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      )}
      <div ref={containerRef} className="h-full w-full overflow-hidden" />
      {/* TODO: Fix zoom functionality */}
      {/* <Button
        size="icon"
        variant="outline"
        className="absolute bottom-16 left-4 z-10 backdrop-blur-sm"
        onClick={handleZoomIn}
      >
        <PlusIcon className="h-5 w-5" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        className="absolute bottom-4 left-4 z-10 backdrop-blur-sm"
        onClick={handleZoomOut}
      >
        <MinusIcon className="h-5 w-5" />
      </Button> */}
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
