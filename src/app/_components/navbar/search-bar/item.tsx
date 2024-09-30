import { CommandItem } from "@/components/ui/command";
import DottedList from "@/components/ui/dotted-list";
import { usePathLocale } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import type { GenreDocument } from "@/types/genre";
import type { GlobalSearchDocument } from "@/types/global-search-document";
import { useTranslations } from "next-intl";

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

const getLocalizedTypeKey = (
  type: GlobalSearchDocument["type"],
): keyof IntlMessages["entities"] | null => {
  if (type === "book") {
    return "text";
  } else if (type === "author") {
    return "author";
  } else if (type === "genre") {
    return "genre";
  } else if (type === "region") {
    return "region";
  }

  return null;
};

function SearchBarItem({
  onSelect,
  document,
}: {
  onSelect: (href?: string) => void;
  document: GlobalSearchDocument;
}) {
  const href = getHref(document);
  const pathLocale = usePathLocale();
  const t = useTranslations("entities");
  const Comp = (href ? Link : "button") as any;

  const names =
    document.primaryNames ??
    (document as unknown as GenreDocument).nameTranslations;

  const primaryName =
    pathLocale === "en" &&
    (document as unknown as GenreDocument).transliteration
      ? (document as unknown as GenreDocument).transliteration
      : getPrimaryLocalizedText(names, pathLocale);
  const secondaryName = getSecondaryLocalizedText(names, pathLocale);

  const finalPrimaryName = primaryName ?? secondaryName;
  const finalSecondaryName = primaryName ? secondaryName : null;

  const authorName = getPrimaryLocalizedText(
    document.author?.primaryNames ?? [],
    pathLocale,
  );

  const type = document.type;
  const localizedType = t(getLocalizedTypeKey(type) ?? "no-entity");

  // key={result.document.id}
  // value={result.document.id}
  // onSelect={() => onItemSelect(href ?? undefined)}
  // href={href ?? ""}

  return (
    <CommandItem
      value={document.id}
      onSelect={() => onSelect(href ?? undefined)}
      className="px-0 py-0"
    >
      <Comp
        {...(href ? { href, prefetch: true } : {})}
        className="flex h-full w-full items-start justify-between px-4 py-3 hover:bg-accent"
      >
        <DottedList
          className="gap-2"
          dotClassName="ltr:ml-2 rtl:mr-2"
          items={[
            finalPrimaryName && {
              text: finalPrimaryName,
              className: "text-base",
            },
            finalSecondaryName && {
              text: finalSecondaryName,
              className: "text-muted-foreground",
            },
            authorName && {
              text: authorName,
              className: "text-muted-foreground",
            },
          ]}
        />

        <p className="text-muted-foreground">{localizedType}</p>
      </Comp>
    </CommandItem>
  );
}

export default SearchBarItem;
