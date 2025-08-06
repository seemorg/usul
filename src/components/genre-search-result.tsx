import type { GenreDocument } from "@/types/genre";
import { navigation } from "@/lib/urls";
import { useTranslations } from "next-intl";

import EntityCard from "./entity-card";

export default function GenreSearchResult({
  result,
  prefetch = true,
}: {
  result: GenreDocument;
  prefetch?: boolean;
}) {
  const t = useTranslations("entities");

  return (
    <EntityCard
      href={navigation.genres.bySlug(result.slug)}
      prefetch={prefetch}
      primaryTitle={result.primaryName}
      secondaryTitle={result.secondaryName}
      tags={[t("x-texts", { count: result.booksCount })]}
    />
  );
}
