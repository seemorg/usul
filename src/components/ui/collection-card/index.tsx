"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";

export interface CollectionCardProps {
  title: string;
  numberOfBooks: number;
  pattern: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  color: "gray" | "red" | "green" | "yellow" | "indigo";
  patternSrcPrefix?: string;
}

const variants = {
  gray: {
    bg: "bg-collection-gray",
    gradientFrom: "from-collection-gray",
    gradientFrom10: "from-collection-gray/[.01]",
  },
  red: {
    bg: "bg-collection-red",
    gradientFrom: "from-collection-red",
    gradientFrom10: "from-collection-red/[.01]",
  },
  green: {
    bg: "bg-collection-green",
    gradientFrom: "from-collection-green",
    gradientFrom10: "from-collection-green/[.01]",
  },
  yellow: {
    bg: "bg-collection-yellow",
    gradientFrom: "from-collection-yellow",
    gradientFrom10: "from-collection-yellow/[.01]",
  },
  indigo: {
    bg: "bg-collection-indigo",
    gradientFrom: "from-collection-indigo",
    gradientFrom10: "from-collection-indigo/[.01]",
  },
};

export const CollectionCard = ({
  title,
  numberOfBooks,
  pattern,
  color,
  patternSrcPrefix = "/patterns/",
}: CollectionCardProps) => {
  const t = useTranslations("entities");
  const variant = variants[color];

  return (
    <div
      style={{
        backgroundImage: `url("${patternSrcPrefix}${pattern}.svg")`,
      }}
      className={clsx(
        "blur-0 relative isolate flex h-44 w-44 flex-col justify-end overflow-hidden rounded-2xl p-4",
        variant.bg,
      )}
    >
      <div
        className={clsx(
          "absolute inset-0 -z-2 bg-linear-to-t to-transparent",
          variant.gradientFrom,
        )}
      />

      <div
        className={clsx(
          "absolute right-0 bottom-0 left-0 -z-1 h-20 bg-linear-to-t to-transparent [mask-image:linear-gradient(to_top,black,transparent)] backdrop-blur-[2px]",
          variant.gradientFrom10,
        )}
      />

      <h2 className="line-clamp-2 min-w-0 text-xl font-medium break-words text-white">
        {title}
      </h2>
      <p className="mt-1.5 text-sm text-white/80">
        {t("x-texts", { count: numberOfBooks })}
      </p>
    </div>
  );
};
