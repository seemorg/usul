/* eslint-disable react/jsx-key */
import type { searchAuthors } from "@/server/typesense/author";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import DottedList from "./ui/dotted-list";
import { getTranslations } from "next-intl/server";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import type { AppLocale } from "~/i18n.config";
import { supportedBcp47LocaleToPathLocale } from "@/lib/locale/utils";

const AuthorSearchResult = async ({
  result,
  locale,
}: {
  result: NonNullable<
    Awaited<ReturnType<typeof searchAuthors>>["results"]["hits"]
  >[number];
  locale: AppLocale;
}) => {
  const t = await getTranslations({ locale });
  const pathLocale = supportedBcp47LocaleToPathLocale(locale);

  const { document } = result;

  // const primaryArabicName = highlight?.primaryArabicName?.snippet
  //   ? highlight.primaryArabicName.snippet
  //   : document.primaryArabicName;
  // const primaryLatinName = highlight?.primaryLatinName?.snippet
  //   ? highlight.primaryLatinName.snippet
  //   : document.primaryLatinName;
  const primaryName = getPrimaryLocalizedText(
    document.primaryNames,
    pathLocale,
  );
  const secondaryName = getSecondaryLocalizedText(
    document.primaryNames,
    pathLocale,
  );

  return (
    <Link
      href={navigation.authors.bySlug(document.slug)}
      prefetch={false}
      className="w-full border-b border-border bg-transparent px-6 py-4 transition-colors hover:bg-secondary"
    >
      <div className="flex items-center justify-between">
        <div className="max-w-[70%]">
          {primaryName && (
            <h2
              className="text-xl text-foreground"
              dangerouslySetInnerHTML={{
                __html: primaryName,
              }}
            />
          )}

          <DottedList
            className="mt-5 text-muted-foreground"
            items={[
              secondaryName && (
                <h2
                  className={cn(primaryName ? "text-lg" : "text-xl")}
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
