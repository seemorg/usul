/* eslint-disable react/jsx-key */
import { navigation } from "@/lib/urls";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import type { GlobalSearchDocument } from "@/types/global-search-document";
import { useTranslations } from "next-intl";
import SearchBarItem from "./item";
import { usePathLocale } from "@/lib/locale/utils";
import DottedList from "@/components/ui/dotted-list";
import type { prepareResults } from "@/server/typesense/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComingSoonModal from "@/components/coming-soon-modal";
import type { SearchType } from "@/types/search";
import { CommandEmpty } from "@/components/ui/command";

const getHref = (document: GlobalSearchDocument) => {
  if (document.type === "book") {
    return navigation.books.reader(document.slug);
  } else if (document.type === "author") {
    return navigation.authors.bySlug(document.slug);
  } else if (document.type === "genre") {
    return navigation.genres.bySlug(document.slug);
  } else if (document.type === "region") {
    return navigation.regions.bySlug(document.slug);
  }

  return null;
};

export default function SearchBarResults({
  results,
  onItemSelect,
  searchType,
  setSearchType,
}: {
  results?: ReturnType<typeof prepareResults<GlobalSearchDocument>>;
  onItemSelect: (href?: string) => void;
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
}) {
  const t = useTranslations();
  const entitiesT = useTranslations("entities");
  const pathLocale = usePathLocale();

  const getLocalizedType = (type: GlobalSearchDocument["type"]) => {
    if (type === "book") {
      return entitiesT("text");
    } else if (type === "author") {
      return entitiesT("author");
    } else if (type === "genre") {
      return entitiesT("genre");
    } else if (type === "region") {
      return entitiesT("region");
    }

    return null;
  };

  const hits = results?.hits ?? [];

  const items = hits.map((result) => {
    const primaryName =
      getPrimaryLocalizedText(result.document.primaryNames, pathLocale) ??
      (result.document as any).name;

    const secondaryName = getSecondaryLocalizedText(
      result.document.primaryNames,
      pathLocale,
    );

    const finalPrimaryName = primaryName ?? secondaryName;
    const finalSecondaryName = primaryName ? secondaryName : null;

    const authorName = getPrimaryLocalizedText(
      result.document.author?.primaryNames ?? [],
      pathLocale,
    );

    const type = result.document.type;
    const localizedType = getLocalizedType(type);
    const href = getHref(result.document);

    return (
      <SearchBarItem
        key={result.document.id}
        value={result.document.id}
        onSelect={() => onItemSelect(href ?? undefined)}
        href={href ?? ""}
      >
        <DottedList
          className="gap-2"
          dotClassName="ltr:ml-2 rtl:mr-2"
          items={[
            finalPrimaryName && (
              <p
                className="text-base"
                dangerouslySetInnerHTML={{ __html: finalPrimaryName }}
              />
            ),
            finalSecondaryName && (
              <p
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: finalSecondaryName,
                }}
              />
            ),
            authorName && (
              <p
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: authorName,
                }}
              />
            ),
          ]}
        />

        <p className="text-muted-foreground">{localizedType}</p>
      </SearchBarItem>
    );
  });

  const showSeeMore = (results?.found ?? 0) > 5 && hits.length > 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Tabs
          value={searchType}
          onValueChange={(value) =>
            setSearchType(value as "all" | "texts" | "authors" | "genres")
          }
        >
          <TabsList>
            <TabsTrigger value="all">{entitiesT("all")}</TabsTrigger>
            <TabsTrigger value="texts">{entitiesT("texts")}</TabsTrigger>
            <TabsTrigger value="authors">{entitiesT("authors")}</TabsTrigger>
            <TabsTrigger value="genres">{entitiesT("genres")}</TabsTrigger>
          </TabsList>
        </Tabs>

        {showSeeMore && (
          <ComingSoonModal
            trigger={
              <button className="text-primary underline">
                {t("common.search-bar.all-results", {
                  results: results?.found,
                })}
              </button>
            }
          />
        )}
      </div>

      <div className="mt-5">
        {hits.length > 0 ? (
          items
        ) : (
          <CommandEmpty>{t("common.search-bar.no-results")}</CommandEmpty>
        )}
      </div>
    </div>
  );
}
