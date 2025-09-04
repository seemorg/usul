import React from "react";
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
import { useTranslations } from "next-intl";

export const EmptyAlert = () => {
  const t = useTranslations();

  return (
    <div className="border-border flex w-full items-center justify-center rounded-md border py-4">
      <p className="text-muted-foreground text-sm">
        {t("entities.no-entity", { entity: "results" })}
      </p>
    </div>
  );
};

export default function SearchCarousel({
  title,
  allHref,
  children,
  itemClassName,
  slidesPerScroll,
}: {
  title: string;
  allHref?: string;
  children: React.ReactNode;
  itemClassName?: string;
  slidesPerScroll?: number;
}) {
  const dir = useDirection();
  const t = useTranslations();

  return (
    <Carousel
      className="relative w-full"
      opts={{ direction: dir }}
      slidesPerScroll={slidesPerScroll}
    >
      <div className="flex items-center justify-between py-4">
        <p className="text-lg font-semibold">{title}</p>
        <div className="flex items-center gap-2">
          {allHref && (
            <Link href={allHref} className="text-primary text-sm">
              {t("common.view-all")}
            </Link>
          )}
          <div className="w-3" />
          <CarouselPrevious className="bg-muted text-muted-foreground hover:bg-muted/60 size-8 shadow-none" />
          <CarouselNext className="bg-muted text-muted-foreground hover:bg-muted/60 size-8 shadow-none" />
        </div>
      </div>

      {React.Children.count(children) === 0 ? (
        <EmptyAlert />
      ) : (
        <CarouselContent>
          {React.Children.map(children, (item, idx) => (
            <CarouselItem
              className={cn("shrink-0 basis-auto", itemClassName)}
              key={idx}
            >
              {item}
            </CarouselItem>
          ))}
        </CarouselContent>
      )}
    </Carousel>
  );
}
