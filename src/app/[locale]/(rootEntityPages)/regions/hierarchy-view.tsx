"use client";

import HierarchicalListView, {
  type HierarchicalItem,
} from "@/components/hierarchical-list-view";
import { navigation } from "@/lib/urls";
import { useTranslations } from "next-intl";

type RegionNode = HierarchicalItem & {
  numberOfAuthors: number;
  numberOfBooks: number;
};

export default function RegionsHierarchyView({
  hierarchy,
  searchQuery,
  placeholder,
}: {
  hierarchy: RegionNode[];
  searchQuery?: string;
  placeholder?: string;
}) {
  const t = useTranslations("entities");

  return (
    <HierarchicalListView
      hierarchy={hierarchy}
      getHref={(item) =>
        item.numberOfBooks > 0 || item.numberOfAuthors > 0
          ? navigation.regions.bySlug(item.slug)
          : null
      }
      renderStats={(item) => (
        <>
          {item.numberOfBooks > 0 && (
            <span>{t("x-texts", { count: item.numberOfBooks })}</span>
          )}
          {item.numberOfAuthors > 0 && (
            <span>{t("x-authors", { count: item.numberOfAuthors })}</span>
          )}
        </>
      )}
      searchQuery={searchQuery}
      placeholder={placeholder}
      emptyMessage={t("no-entity", { entity: t("regions") })}
    />
  );
}
