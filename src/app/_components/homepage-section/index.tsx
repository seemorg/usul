"use client";

import { Link } from "@/navigation";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import ComingSoonModal from "@/components/coming-soon-modal";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDirection } from "@/lib/locale/utils";

const HomepageSection = ({
  title,
  href,
  items,
}: {
  title: string;
  href?: string;
  items: React.ReactNode[];
}) => {
  const dir = useDirection();

  const sectionTitle = (
    <h2 className="group flex items-center gap-1 text-2xl font-semibold transition-colors hover:text-primary">
      {title}{" "}
      <ChevronRightIcon className="mt-[3px] h-6 w-6 text-gray-400 transition group-hover:text-primary rtl:rotate-180" />
    </h2>
  );

  return (
    <Carousel className="relative w-full pb-10" opts={{ direction: dir }}>
      <div className="flex items-center justify-between">
        {href ? (
          <Link href={href}>{sectionTitle}</Link>
        ) : (
          <ComingSoonModal trigger={sectionTitle} />
        )}

        <div className="flex items-center">
          <CarouselPrevious />

          <CarouselNext />
        </div>
      </div>

      {/* <ScrollArea className="relative mt-10 w-full whitespace-nowrap">
        <div className="flex gap-5 pb-10">{children}</div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea> */}

      <CarouselContent className="mt-5 sm:mt-10">
        {items.map((item, idx) => (
          <CarouselItem className="flex-shrink-0 basis-auto" key={idx}>
            <div className="w-[140px] flex-shrink-0 sm:w-[160px] md:w-[180px]">
              {item}
            </div>
            {idx !== items.length - 1 && (
              <div className="w-3 flex-shrink-0 sm:w-5" />
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default HomepageSection;
