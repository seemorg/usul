import type { GenreDocument } from "@/types/genre";
import type { GlobalSearchDocument } from "@/types/global-search-document";
import {
  getGlobalDocumentHref,
  getGlobalDocumentLocalizedTypeKey,
} from "@/lib/global-search";
import { getPathLocale } from "@/lib/locale/server";
import { Link } from "@/navigation";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import { getTranslations } from "next-intl/server";

import DottedList from "./ui/dotted-list";

export default async function GlobalSearchResult({
  result,
  prefetch = true,
}: {
  result: { document: GlobalSearchDocument };
  prefetch?: boolean;
}) {
  const t = await getTranslations("entities");
  const pathLocale = await getPathLocale();

  const document = result.document;

  const href = getGlobalDocumentHref(document);
  const type = document.type;

  const names =
    document.primaryNames ??
    (document as unknown as GenreDocument).nameTranslations;

  const primaryName =
    pathLocale === "en" &&
    (document as unknown as GenreDocument).transliteration &&
    type !== "genre"
      ? (document as unknown as GenreDocument).transliteration
      : getPrimaryLocalizedText(names, pathLocale);

  const secondaryName = getSecondaryLocalizedText(names, pathLocale);

  const finalPrimaryName = primaryName ?? secondaryName;
  const finalSecondaryName = primaryName ? secondaryName : null;

  const authorName = getPrimaryLocalizedText(
    document.author?.primaryNames ?? [],
    pathLocale,
  );

  const localizedType = t(
    getGlobalDocumentLocalizedTypeKey(type) ?? "no-entity",
  );

  return (
    <Link
      href={href!}
      prefetch={prefetch}
      className="border-border hover:bg-secondary w-full border-b bg-transparent px-6 py-6 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {finalPrimaryName && (
            <h2 className="text-foreground text-xl">{finalPrimaryName}</h2>
          )}

          <DottedList
            className="gap-2"
            dotClassName="ltr:ml-2 rtl:mr-2"
            items={[
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
        </div>

        <p className="text-muted-foreground">{localizedType}</p>
      </div>
    </Link>
  );
}
