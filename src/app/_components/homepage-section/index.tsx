"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "usehooks-ts";
import Swiper from "swiper";
import { Navigation } from "swiper/modules";

const HomepageSection = ({
  title,
  href,
  items,
}: {
  title: string;
  href: string;
  items: React.ReactNode[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const swiper = useRef<Swiper>();

  const [navigation, setNavigation] = useState({
    hasPrev: false,
    hasNext: true,
  });

  useIsomorphicLayoutEffect(() => {
    swiper.current = new Swiper(containerRef.current!, {
      modules: [Navigation],
      direction: "horizontal",
      freeMode: true,
      // watchSlidesProgress: true,
      // slidesPerView: "auto",
      // slidesPerGroupSkip: 1,

      watchOverflow: true,
      breakpoints: {
        320: {
          slidesPerView: 2.2,
        },
        640: {
          slidesPerView: 3.5,
        },
        768: {
          slidesPerView: "auto",
        },
      },
      on: {
        slideChange: (e) => {
          console.log({
            activeIndex: e.activeIndex,
            slides: e.slides.length,
          });

          setNavigation({
            hasPrev: e.activeIndex !== 0,
            hasNext: e.activeIndex !== e.slides.length - 2,
          });
        },
      },
    });
  }, []);

  const prev = () => {
    swiper.current?.slidePrev();
  };

  const next = () => {
    swiper.current?.slideNext();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Link href={href}>
          <h2 className="group flex items-center gap-1 text-2xl font-semibold transition-colors hover:text-primary">
            {title}{" "}
            <ChevronRightIcon className="mt-[3px] h-6 w-6 text-gray-400 transition group-hover:text-primary rtl:rotate-180" />
          </h2>
        </Link>

        <div className="flex items-center">
          <Button
            size="icon"
            variant="ghost"
            onClick={prev}
            disabled={!navigation.hasPrev}
          >
            <ChevronLeftIcon className="h-5 w-5 rtl:rotate-180" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={next}
            disabled={!navigation.hasNext}
          >
            <ChevronRightIcon className="h-5 w-5 rtl:rotate-180" />
          </Button>
        </div>
      </div>

      {/* <ScrollArea className="relative mt-10 w-full whitespace-nowrap">
        <div className="flex gap-5 pb-10">{children}</div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea> */}

      <div ref={containerRef} className="swiper relative mt-10 w-full">
        <div className="swiper-wrapper w-full pb-10">
          {items.map((item, idx) => (
            <div className="swiper-slide flex !w-auto flex-shrink-0" key={idx}>
              <div className="w-[140px] flex-shrink-0 sm:w-[160px] md:w-[180px]">
                {item}
              </div>
              {idx !== items.length - 1 && (
                <div className="w-3 flex-shrink-0 sm:w-5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomepageSection;
