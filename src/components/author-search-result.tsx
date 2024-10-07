/* eslint-disable react/jsx-key */
import type { searchAuthors } from "@/server/typesense/author";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import DottedList from "./ui/dotted-list";
import { getTranslations } from "next-intl/server";
import { getPathLocale } from "@/lib/locale/server";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";

const AuthorSearchResult = async ({
  result,
  prefetch = true,
}: {
  result: Awaited<ReturnType<typeof searchAuthors>>["results"]["hits"][number];
  prefetch?: boolean;
}) => {
  const t = await getTranslations();
  const pathLocale = await getPathLocale();

  const { document } = result;

  const primaryName =
    document.transliteration && pathLocale === "en"
      ? document.transliteration
      : getPrimaryLocalizedText(document.primaryNames, pathLocale);
  const secondaryName = getSecondaryLocalizedText(
    document.primaryNames,
    pathLocale,
  );

  return (
    <Link
      href={navigation.authors.bySlug(document.slug)}
      prefetch={prefetch}
      className="w-full border-b border-border bg-transparent px-6 py-4 transition-colors hover:bg-secondary"
    >
      <div className="flex items-center justify-between">
        <div className="max-w-[70%]">
          {primaryName && (
            <h2
              className="text-lg font-semibold"
              dangerouslySetInnerHTML={{
                __html: primaryName,
              }}
            />
          )}

          <DottedList
            className="mt-2 text-xs text-muted-foreground"
            items={[
              secondaryName && (
                <h2
                  dangerouslySetInnerHTML={{
                    __html: secondaryName,
                  }}
                />
              ),
              <p>{t("entities.x-texts", { count: document.booksCount })}</p>,
            ]}
          />
        </div>

        <div className="text-center">
          {t("common.year-format.ah.value", { year: document.year })}
        </div>
      </div>
    </Link>
  );
};

export default AuthorSearchResult;
