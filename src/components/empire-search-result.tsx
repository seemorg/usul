import type { EmpireDocument } from "@/types/empire";
import { navigation } from "@/lib/urls";
import { useTranslations } from "next-intl";

import EntityCard from "./entity-card";

export default function EmpireSearchResult({
  result,
  prefetch = true,
}: {
  result: EmpireDocument;
  prefetch?: boolean;
}) {
  const t = useTranslations();

  const primaryName = result.primaryName;
  const secondaryName = result.secondaryName;

  const totalBooks = result.booksCount;

  return (
    <EntityCard
      href={navigation.empires.bySlug(result.slug)}
      prefetch={prefetch}
      primaryTitle={primaryName}
      secondaryTitle={secondaryName}
      tags={[t("entities.x-texts", { count: totalBooks })]}
    />
  );
}
