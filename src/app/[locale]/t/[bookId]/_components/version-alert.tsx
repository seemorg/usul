"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { versionToName } from "@/lib/version";
import { usePathname, useRouter } from "@/navigation";
import type { ApiBookResponse } from "@/types/api/book";
import { InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export const VersionAlert = ({
  versionId,
  feature,
  versions,
}: {
  versionId: string;
  feature: "ask-ai" | "search";
  versions: ApiBookResponse["book"]["versions"];
}) => {
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const versionObj = versions.find((v) => v.id === versionId);

  if (!versionObj) {
    return null;
  }

  const switchVersion = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("versionId", versionId);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <Alert className="border-border bg-transparent">
      <InfoIcon className="size-4" />
      <AlertTitle>
        {t.rich("reader.edition-warning", {
          feature: t(feature === "search" ? "common.search" : "reader.ask-ai"),
        })}
      </AlertTitle>

      <AlertDescription className="mt-2">
        <button onClick={switchVersion} className="text-primary underline">
          {t("reader.switch-edition", { edition: versionToName(versionObj) })}
        </button>
      </AlertDescription>
    </Alert>
  );
};
