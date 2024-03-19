/* eslint-disable react/jsx-key */
import type { searchAuthors } from "@/lib/search";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import DottedList from "./ui/dotted-list";
import { getTranslations } from "next-intl/server";

const AuthorSearchResult = async ({
  result,
}: {
  result: NonNullable<
    Awaited<ReturnType<typeof searchAuthors>>["results"]["hits"]
  >[number];
}) => {
  const t = await getTranslations();

  const { document, highlight } = result;

  const primaryArabicName = highlight?.primaryArabicName?.snippet
    ? highlight.primaryArabicName.snippet
    : document.primaryArabicName;
  const primaryLatinName = highlight?.primaryLatinName?.snippet
    ? highlight.primaryLatinName.snippet
    : document.primaryLatinName;

  return (
    <Link
      href={navigation.authors.bySlug(document.slug)}
      prefetch={false}
      className="w-full border-b border-border bg-transparent px-6 py-4 transition-colors hover:bg-secondary"
    >
      <div className="flex items-center justify-between">
        <div className="max-w-[70%]">
          {primaryArabicName && (
            <h2
              className="text-xl text-foreground"
              dangerouslySetInnerHTML={{
                __html: primaryArabicName,
              }}
            />
          )}

          <DottedList
            className="mt-5 text-muted-foreground"
            items={[
              primaryLatinName && (
                <h2
                  className={cn(primaryArabicName ? "text-lg" : "text-xl")}
                  dangerouslySetInnerHTML={{
                    __html: primaryLatinName,
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
