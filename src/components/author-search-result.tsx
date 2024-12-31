import type { searchAuthors } from "@/server/typesense/author";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import {
  getPrimaryLocalizedText,
  getSecondaryLocalizedText,
} from "@/server/db/localization";
import { Badge } from "./ui/badge";
import { usePathLocale } from "@/lib/locale/utils";
import { useTranslations } from "next-intl";

const AuthorSearchResult = ({
  result,
  prefetch = true,
}: {
  result: Awaited<ReturnType<typeof searchAuthors>>["results"]["hits"][number];
  prefetch?: boolean;
}) => {
  const t = useTranslations();
  const pathLocale = usePathLocale();

  const { document } = result;

  const primaryName =
    document.transliteration && pathLocale === "en"
      ? document.transliteration
      : getPrimaryLocalizedText(document.primaryNames, pathLocale);

  const secondaryName = getSecondaryLocalizedText(
    document.primaryNames,
    pathLocale,
  );

  const deathYearString =
    document.year && document.year > 0
      ? ` (d. ${document.year} AH)`
      : ` (d. Unknown)`;

  return (
    <Link
      href={navigation.authors.bySlug(document.slug)}
      prefetch={prefetch}
      className="w-full border-b border-border bg-transparent px-2 py-6 transition-colors hover:bg-secondary/50 sm:px-3"
    >
      <div className="flex w-full items-center justify-between gap-3">
        {primaryName && (
          <div className="flex-1">
            <h3
              className="text-lg font-bold"
              dangerouslySetInnerHTML={{
                __html: primaryName + deathYearString,
              }}
            />
          </div>
        )}

        {secondaryName && (
          <div className="flex-1" dir="rtl">
            <h3
              className="text-lg font-bold"
              dangerouslySetInnerHTML={{
                __html: secondaryName + deathYearString,
              }}
            />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Badge variant="muted">
          <p>{t("entities.x-texts", { count: document.booksCount })}</p>
        </Badge>
      </div>
    </Link>
  );
};

export default AuthorSearchResult;
