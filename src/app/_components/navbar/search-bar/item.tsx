import type { GlobalSearchDocument } from "@/types/global-search-document";
import { CommandItem } from "@/components/ui/command";
import DottedList from "@/components/ui/dotted-list";
import {
  getGlobalDocumentHref,
  getGlobalDocumentLocalizedTypeKey,
} from "@/lib/global-search";
import { usePathLocale } from "@/lib/locale/utils";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

function SearchBarItem({
  onSelect,
  document,
}: {
  onSelect: (href?: string) => void;
  document: GlobalSearchDocument;
}) {
  const href = getGlobalDocumentHref(document);
  const pathLocale = usePathLocale();
  const t = useTranslations("entities");
  const Comp = (href ? Link : "button") as any;
  const type = document.type;

  const primaryName =
    pathLocale === "en" && document.transliteration && type !== "genre"
      ? document.transliteration
      : document.primaryName;
  const secondaryName = document.secondaryName;

  const finalPrimaryName = primaryName ?? secondaryName;
  const finalSecondaryName = primaryName ? secondaryName : null;

  const authorName = document.author?.primaryName;

  const localizedType = t(
    getGlobalDocumentLocalizedTypeKey(type) ?? "no-entity",
  );

  return (
    <CommandItem
      value={document.id}
      onSelect={() => onSelect(href ?? undefined)}
      className="px-0 py-0"
    >
      <Comp
        {...(href
          ? {
              href,
              prefetch: true,
              onClick: (e: MouseEvent) => {
                e.stopPropagation();
                onSelect();
              },
            }
          : {})}
        className="hover:bg-accent flex h-full w-full items-start justify-between px-4 py-3"
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
