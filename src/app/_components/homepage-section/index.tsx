"use client";

import ComingSoonModal from "@/components/coming-soon-modal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDirection } from "@/lib/locale/utils";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

const HomepageSection = ({
  title,
  href,
  items,
  constraintWidth,
  isBooks = true,
}: {
  title: string;
  href?: string;
  items: React.ReactNode[];
  constraintWidth?: boolean;
  isBooks?: boolean;
}) => {
  const dir = useDirection();

  const sectionTitle = (
    <h2 className="group hover:text-primary flex items-center gap-1 text-2xl font-semibold transition-colors">
      {title}{" "}
      <ChevronRightIcon className="group-hover:text-primary mt-[3px] h-6 w-6 text-gray-400 transition rtl:rotate-180" />
    </h2>
  );

  return (
    <Carousel
      className={cn("relative w-full", isBooks ? "pb-8 sm:pb-10" : "pb-10")}
      opts={{ direction: dir }}
    >
      <div className="flex items-center justify-between">
        {href ? (
          <Link href={href}>{sectionTitle}</Link>
        ) : (
          <ComingSoonModal trigger={sectionTitle} />
        )}

        <div className="flex items-center gap-2">
          <CarouselPrevious className="hover:bg-accent/80 focus:bg-accent/80 dark:bg-accent/50 disabled:opacity-40" />
          <CarouselNext className="hover:bg-accent/80 focus:bg-accent/80 dark:bg-accent/50 disabled:opacity-40" />
        </div>
      </div>

      <CarouselContent className="mt-6">
        {items.map((item, idx) => (
          <CarouselItem className="shrink-0 basis-auto" key={idx}>
            <div
              className={cn(
                constraintWidth &&
                  "w-[140px] shrink-0 sm:w-[160px] md:w-[180px]",
              )}
            >
              {item}
            </div>
            {idx !== items.length - 1 && (
              <div className="w-3 shrink-0 sm:w-5" />
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default HomepageSection;
