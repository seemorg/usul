"use client";

import { navigation } from "@/lib/urls";
import { Link, useRouter } from "@/navigation";
import { SearchType } from "@/types/search";
import { GlobeIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EmptyState() {
  const t = useTranslations();
  const router = useRouter();
  const prefix = "common.empty-state.search.examples" as const;
  const examples: {
    title: string;
    description: string;
    text: string;
    type: SearchType;
  }[] = [
    {
      title: t(`${prefix}.book-content.title`),
      description: t(`${prefix}.book-content.description`),
      text: "رمضان",
      type: "content",
    },
    {
      title: t(`${prefix}.book-titles.title`),
      description: t(`${prefix}.book-titles.description`),
      text: "صحيح البخاري",
      type: "texts",
    },
    {
      title: t(`${prefix}.author-names.title`),
      description: t(`${prefix}.author-names.description`),
      text: "الامام الشافعي",
      type: "authors",
    },
    {
      title: t(`${prefix}.genres.title`),
      description: t(`${prefix}.genres.description`),
      text: "الفقه",
      type: "genres",
    },
  ];

  const handleExampleClick = (example: (typeof examples)[number]) => {
    router.push(
      navigation.search({
        query: example.text,
        type: example.type,
      }),
      undefined,
      { showProgressBar: true },
    );
  };

  return (
    <div className="mt-20 flex min-h-[350px] w-full flex-col items-center justify-center gap-8 text-center">
      {/* Main Icon */}
      <div className="bg-muted flex size-16 items-center justify-center rounded-full">
        <GlobeIcon className="text-muted-foreground size-8" />
      </div>

      {/* Title and Subtitle */}
      <div className="max-w-md space-y-3">
        <h2 className="text-foreground text-2xl font-semibold">
          {t("common.empty-state.search.title")}
        </h2>
        <p className="text-muted-foreground text-base leading-relaxed">
          {t("common.empty-state.search.subtitle")}
        </p>
      </div>

      <div className="max-w-3xl">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {examples.map((example, index) => (
            <button
              onClick={() => handleExampleClick(example)}
              key={index}
              className="border-border/50 bg-card hover:bg-accent cursor-pointer rounded-lg border p-3 text-left transition-colors"
            >
              <h4 className="text-foreground text-sm font-medium">
                {example.title}
              </h4>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                {example.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
