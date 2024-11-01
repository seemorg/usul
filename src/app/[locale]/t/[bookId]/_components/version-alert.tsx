"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname, useRouter } from "@/navigation";
import { InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export const VersionAlert = ({
  versionId,
  feature,
}: {
  versionId: string;
  feature: "ask-ai" | "search";
}) => {
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const switchVersion = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("versionId", versionId);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <Alert className="border-border bg-transparent">
      <InfoIcon className="h-5 w-5" />
      <AlertTitle>
        {t.rich("reader.edition-warning", {
          feature: t(feature === "search" ? "common.search" : "reader.ask-ai"),
          tooltip: (children) => (
            <Tooltip>
              <TooltipTrigger
                className="pointer min-w-0 break-words underline"
                asChild
              >
                <span>{children}</span>
              </TooltipTrigger>

              <TooltipContent>{versionId}</TooltipContent>
            </Tooltip>
          ),
        })}
      </AlertTitle>

      <AlertDescription className="mt-2">
        <button onClick={switchVersion} className="text-primary underline">
          {t("reader.switch-edition", { edition: versionId })}
        </button>
      </AlertDescription>
    </Alert>
  );
};
