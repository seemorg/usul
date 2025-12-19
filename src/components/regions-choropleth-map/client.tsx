"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

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

// Mapping from region slugs to ISO country codes (ISO_A3 format)
// For modern countries, we can derive the ISO code from the slug
// For historical regions, we map to multiple modern countries
const regionToCountryCode: Record<string, string[]> = {
  // Modern countries (direct mapping)
  egypt: ["EGY"],
  "saudi-arabia": ["SAU"],
  iraq: ["IRQ"],
  syria: ["SYR"],
  iran: ["IRN"],
  yemen: ["YEM"],
  morocco: ["MAR"],
  spain: ["ESP"],
  algeria: ["DZA"],
  turkey: ["TUR"],
  jordan: ["JOR"],
  lebanon: ["LBN"],
  palestine: ["PSE", "ISR"],
  india: ["IND"],
  afghanistan: ["AFG"],
  uzbekistan: ["UZB"],
  kazakhstan: ["KAZ"],
  russia: ["RUS"],
  mauritania: ["MRT"],
  tunisia: ["TUN"],
  libya: ["LBY"],
  pakistan: ["PAK"],
  sudan: ["SDN"],
  azerbaijan: ["AZE"],
  turkmenistan: ["TKM"],
  oman: ["OMN"],
  qatar: ["QAT"],
  kuwait: ["KWT"],
  bahrain: ["BHR"],
  "united-arab-emirates": ["ARE"],
  indonesia: ["IDN"],
  malaysia: ["MYS"],
  bangladesh: ["BGD"],
  ethiopia: ["ETH"],
  senegal: ["SEN"],
  guinea: ["GIN"],
  greece: ["GRC"],
  italy: ["ITA"],
  france: ["FRA"],
  "united-kingdom": ["GBR"],
  germany: ["DEU"],
  austria: ["AUT"],
  switzerland: ["CHE"],
  poland: ["POL"],
  hungary: ["HUN"],
  albania: ["ALB"],
  "bosnia-and-herzegovina": ["BIH"],
  serbia: ["SRB"],
  georgia: ["GEO"],
  armenia: ["ARM"],
  china: ["CHN"],
  japan: ["JPN"],
  "south-korea": ["KOR"],
  thailand: ["THA"],
  vietnam: ["VNM"],
  philippines: ["PHL"],
  "sri-lanka": ["LKA"],
  nigeria: ["NGA"],
  tanzania: ["TZA"],
  kenya: ["KEN"],
  uganda: ["UGA"],
  rwanda: ["RWA"],
  "congo-democratic-republic-(kinshasa)": ["COD"],
  "congo-(brazzaville)": ["COG"],
  cameroon: ["CMR"],
  chad: ["TCD"],
  niger: ["NER"],
  "burkina-faso": ["BFA"],
  ghana: ["GHA"],
  "cote-d'ivoire": ["CIV"],
  liberia: ["LBR"],
  "sierra-leone": ["SLE"],
  gambia: ["GMB"],
  benin: ["BEN"],
  togo: ["TGO"],
  gabon: ["GAB"],
  "equatorial-guinea": ["GNQ"],
  "central-african-republic": ["CAF"],
  somalia: ["SOM"],
  eritrea: ["ERI"],
  djibouti: ["DJI"],
  "south-sudan": ["SSD"],
  mozambique: ["MOZ"],
  malawi: ["MWI"],
  zambia: ["ZMB"],
  zimbabwe: ["ZWE"],
  botswana: ["BWA"],
  namibia: ["NAM"],
  "south-africa": ["ZAF"],
  lesotho: ["LSO"],
  swaziland: ["SWZ"],
  madagascar: ["MDG"],
  mauritius: ["MUS"],
  seychelles: ["SYC"],
  comoros: ["COM"],
  "cape-verde": ["CPV"],
  "sao-tome-and-principe": ["STP"],
  "guinea-bissau": ["GNB"],
  burundi: ["BDI"],
  mali: ["MLI"],
  angola: ["AGO"],
  america: ["USA"], // United States of America
  brazil: ["BRA"], // Brazil
  argentina: ["ARG"],
  australia: ["AUS"],
  belarus: ["BLR"],
  belgium: ["BEL"],
  bolivia: ["BOL"],
  bulgaria: ["BGR"],
  canada: ["CAN"],
  chile: ["CHL"],
  colombia: ["COL"],
  "costa-rica": ["CRI"],
  cyprus: ["CYP"],
  denmark: ["DNK"],
  "dominican-republic": ["DOM"],
  ecuador: ["ECU"],
  "el-salvador": ["SLV"],
  estonia: ["EST"],
  fiji: ["FJI"],
  finland: ["FIN"],
  guatemala: ["GTM"],
  iceland: ["ISL"],
  ireland: ["IRL"],
  laos: ["LAO"],
  liechtenstein: ["LIE"],
  malta: ["MLT"],
  mexico: ["MEX"],
  moldova: ["MDA"],
  monaco: ["MCO"],
  mongolia: ["MNG"],
  montenegro: ["MNE"],
  "myanmar-(burma)": ["MMR"],
  nepal: ["NPL"],
  netherlands: ["NLD"],
  "new-zealand": ["NZL"],
  norway: ["NOR"],
  panama: ["PAN"],
  paraguay: ["PRY"],
  peru: ["PER"],
  portugal: ["PRT"],
  romania: ["ROU"],
  "san-marino": ["SMR"],
  sweden: ["SWE"],
  taiwan: ["TWN"],
  ukraine: ["UKR"],
  uruguay: ["URY"],
  vatican: ["VAT"],
  venezuela: ["VEN"],
  wales: ["GBR"], // Part of United Kingdom
  // Historical regions that may map to multiple countries
  //   sham: ["SYR", "LBN", "JOR", "PSE", "ISR"],
  //   "jazirat-al-arab": ["SAU", "YEM", "OMN", "ARE", "KWT", "BHR", "QAT"],
  //   jibal: ["IRN"], // Central Iran
  //   khurasan: ["IRN", "AFG", "TKM"], // Northeast Iran, parts of Afghanistan and Turkmenistan
  //   andalus: ["ESP", "PRT"], // Spain and Portugal
  //   aqur: [], // Uncertain historical region
  //   faris: ["IRN"], // Persia/Iran
  //   daylam: ["IRN"], // Northern Iran
  //   khuzistan: ["IRN"], // Khuzestan Province, Iran
  //   kirman: ["IRN"], // Kerman Province, Iran
  //   sijistan: ["IRN", "AFG"], // Sistan region
  //   sind: ["PAK"], // Sindh Province, Pakistan
  //   hind: ["IND", "PAK", "BGD"], // India
  //   transoxiana: ["UZB", "TJK", "KAZ", "KGZ"], // Central Asia
  //   maghrib: ["MAR", "DZA", "TUN", "LBY", "MRT"], // Northwest Africa
  //   barqa: ["LBY"], // Cyrenaica region, Libya
  //   sicile: ["ITA"], // Sicily
  //   rum: ["TUR"], // Anatolia/Turkey
};

export default function RegionsChoroplethMap({
  data,
}: RegionsChoroplethMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const isMountedRef = useRef(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Set up dimensions observer
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: Math.max(rect.height, 500),
        });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Create the map
  useEffect(() => {
    if (
      !containerRef.current ||
      dimensions.width === 0 ||
      !data ||
      data.length === 0
    )
      return;

    isMountedRef.current = true;
    const width = dimensions.width;
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

    // Debug: log the data map
    console.log("Region data map:", Array.from(dataMap.entries()));

    // Create SVG
    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("style", "width: 100%; height: 100%; cursor: grab;");

    const g = svg.append("g");

    // Projection
    const initialScale = width / 6.5;
    const projection = d3
      .geoMercator()
      .scale(initialScale)
      .center([0, 20])
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Track current projection state for zoom-to-cursor
    let currentScale = initialScale;
    let currentTranslate: [number, number] = [width / 2, height / 2];
    let previousK = 1;
    let lastPanPoint: [number, number] | null = null;

    // Zoom behavior with zoom-to-cursor
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8]) // Allow zoom from 0.5x to 8x
      .on("start", (event) => {
        svg.style("cursor", "grabbing");
        const mousePos = d3.pointer(event, svg.node());
        if (mousePos) {
          lastPanPoint = [mousePos[0], mousePos[1]];
        }
      })
      .on("zoom", (event) => {
        const { transform } = event;
        const mousePos = d3.pointer(event, svg.node());
        if (!mousePos || !projection.invert) return;

        const [mouseX, mouseY] = mousePos;
        const isZooming = transform.k !== previousK;

        if (isZooming) {
          // Zoom operation - zoom to cursor
          // Set projection to current state to get accurate inverse
          projection.scale(currentScale).translate(currentTranslate);

          // Get the geographic coordinates at the mouse position
          const geoCoords = projection.invert([mouseX, mouseY]);
          if (geoCoords && Array.isArray(geoCoords) && geoCoords.length === 2) {
            const [lon0, lat0] = geoCoords as [number, number];

            // Update the projection scale
            const newScale = initialScale * transform.k;
            currentScale = newScale;
            projection.scale(newScale);

            // Calculate where the geographic point would be with new scale but old translate
            projection.scale(newScale).translate(currentTranslate);
            const projected = projection([lon0, lat0]);
            if (
              projected &&
              Array.isArray(projected) &&
              projected.length === 2
            ) {
              const [x0, y0] = projected;

              // Adjust translate so the point ends up at mouse position
              // The difference between where it is (x0, y0) and where we want it (mouseX, mouseY)
              currentTranslate = [
                currentTranslate[0] + (mouseX - x0),
                currentTranslate[1] + (mouseY - y0),
              ];
              projection.translate(currentTranslate);
            }
          } else {
            // If invert fails, just update scale
            currentScale = initialScale * transform.k;
            projection.scale(currentScale).translate(currentTranslate);
          }
          previousK = transform.k;
          lastPanPoint = [mouseX, mouseY];
        } else {
          // Pan operation - track mouse movement
          if (lastPanPoint) {
            const dx = mouseX - lastPanPoint[0];
            const dy = mouseY - lastPanPoint[1];

            currentTranslate = [
              currentTranslate[0] + dx,
              currentTranslate[1] + dy,
            ];
            projection.scale(currentScale).translate(currentTranslate);
            lastPanPoint = [mouseX, mouseY];
          }
        }

        // Redraw all paths with new projection
        g.selectAll<SVGPathElement, GeoJSON.Feature>("path").attr("d", (d) =>
          path(d),
        );
      })
      .on("end", () => {
        svg.style("cursor", "grab");
        lastPanPoint = null;
      });

    // Apply zoom to SVG
    (svg as any).call(zoom);

    // Color scale based on numberOfBooks
    // Range from 1 to 1000, with 1000+ getting the max color
    const colorScale = d3
      .scaleThreshold<number, string>()
      .domain([15, 50, 100, 500, 750, 900, 1000])
      .range([
        "#e3f2fd",
        "#b3e5fc",
        "#90caf9",
        "#42a5f5",
        "#1e88e5",
        "#1565c0",
        "#0d47a1",
        "#0d47a1", // Max color for 1000+
      ]);

    // Remove existing tooltip if present
    if (tooltipRef.current && document.body.contains(tooltipRef.current)) {
      tooltipRef.current.remove();
    }
    tooltipRef.current = null;

    // Load and draw map
    setIsLoading(true);
    d3.json<GeoJSON.FeatureCollection>(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
    )
      .then((topo) => {
        if (!topo) return;

        // Create tooltip inside the promise to ensure it's accessible
        const tooltip = d3
          .select("body")
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
        console.log("Tooltip created:", tooltipRef.current);

        // Debug: log first feature to see structure
        if (topo.features.length > 0) {
          console.log("Sample GeoJSON feature:", topo.features[0]);
        }

        // Mouse over handler
        const mouseOver = function (event: MouseEvent, d: any) {
          console.log("Mouse over triggered", d);

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

          // Debug: log country code matching
          if (!countryCode) {
            console.log("No country code found for feature:", d);
          }

          const regionData = countryCode ? dataMap.get(countryCode) : null;

          // Debug: log if we found region data
          if (countryCode && !regionData) {
            console.log(
              `No region data found for country code: ${countryCode}`,
            );
          }

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
          const x = event.clientX + 40;
          const y = event.clientY - 0;

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

        // Mouse leave handler
        const mouseLeave = function (event: MouseEvent) {
          d3.select(event.currentTarget as SVGPathElement)
            .transition()
            .duration(200)
            .style("stroke", "transparent")
            .style("stroke-width", 1);

          tooltip.transition().duration(200).style("opacity", 0);
        };

        // Mouse move handler for tooltip
        const mouseMove = function (event: MouseEvent) {
          if (tooltipRef.current) {
            tooltip
              .style("left", `${event.clientX + 40}px`)
              .style("top", `${event.clientY - 0}px`);
          }
        };

        // Log total countries rendered for debugging
        console.log(`Total countries rendered: ${topo.features.length}`);

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
          .on("mousemove", mouseMove);

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
      if (tooltipRef.current && document.body.contains(tooltipRef.current)) {
        tooltipRef.current.remove();
      }
      tooltipRef.current = null;

      // Clean up SVG
      if (svgRef.current && containerRef.current?.contains(svgRef.current)) {
        containerRef.current.removeChild(svgRef.current);
      }
      svgRef.current = null;
    };
  }, [data, dimensions]);

  return (
    <div
      ref={containerRef}
      className="dark:bg-muted-primary relative mb-16 h-[500px] w-full overflow-hidden rounded-lg bg-gray-50"
    >
      {isLoading && (
        <div className="dark:bg-muted-primary/80 absolute inset-0 z-10 flex items-center justify-center bg-gray-50/80">
          <div className="text-gray-500">Loading map...</div>
        </div>
      )}
    </div>
  );
}
