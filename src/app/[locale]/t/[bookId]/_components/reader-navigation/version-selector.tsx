"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { versionToName } from "@/lib/version";
import { usePathname, useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function VersionSelector({
  versions,
  versionId,
}: {
  versions: PrismaJson.BookVersion[];
  versionId: string;
}) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("reader");

  const [selectedVersion, setSelectedVersion] = useState(() => {
    const version = versionId
      ? versions.find((v) => v.id === versionId)?.id ?? versions[0]?.id
      : versions[0]?.id;

    return version;
  });
  const selectedVersionObj = versions.find((v) => v.id === selectedVersion);

  const handleVersionChange = (newVersion: string) => {
    setSelectedVersion(newVersion);

    const newParams = new URLSearchParams(searchParams);

    newParams.set("versionId", newVersion);
    const newUrl = `${pathname}?${newParams.toString()}`;

    startTransition(() => {
      push(newUrl);
    });
  };

  return (
    <div className="group flex items-center">
      <div className="hidden h-9 items-center justify-center rounded-md border border-border px-4 text-muted-foreground md:flex ltr:rounded-r-none rtl:rounded-l-none">
        <Label htmlFor="version-selector">{t("edition")}</Label>
      </div>

      <Select value={selectedVersion} onValueChange={handleVersionChange}>
        <SelectTrigger
          className="w-[170px] overflow-hidden border border-border px-2 shadow-none transition-colors group-hover:bg-accent md:w-[200px] md:px-3 ltr:md:rounded-l-none ltr:md:border-l-0 rtl:md:rounded-r-none rtl:md:border-r-0 [&>span]:min-w-0 [&>span]:max-w-[90%] [&>span]:overflow-ellipsis [&>span]:break-words"
          id="version-selector"
          showIconOnMobile
          isLoading={isPending}
        >
          {selectedVersionObj ? (
            <span>{versionToName(selectedVersionObj)}</span>
          ) : (
            <SelectValue placeholder={t("select-edition")} />
          )}
        </SelectTrigger>

        <SelectContent>
          {versions.map((version, idx) => (
            <SelectItem key={idx} value={version.id}>
              {versionToName(version)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
