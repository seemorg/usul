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
import { Info } from "lucide-react";

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
}: {
  results?: ReturnType<typeof prepareResults<GlobalSearchDocument>>;
  onItemSelect: (href?: string) => void;
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
    const primaryName = getPrimaryLocalizedText(
      result.document.primaryNames,
      pathLocale,
    );
    const secondaryName = getSecondaryLocalizedText(
      result.document.primaryNames,
      pathLocale,
    );

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
            primaryName && (
              <p
                className="text-base"
                dangerouslySetInnerHTML={{ __html: primaryName }}
              />
            ),

            secondaryName && (
              <p
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: secondaryName,
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
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="texts">Texts</TabsTrigger>
            <TabsTrigger value="authors">Authors</TabsTrigger>
            <TabsTrigger value="genres">Genres</TabsTrigger>
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
        {items ? (
          items
        ) : (
          <p className="flex items-center gap-2 text-base text-muted-foreground">
            <Info className="h-4 w-4" />
            {t("common.search-bar.no-results")}
          </p>
        )}
      </div>
    </div>
  );
}
