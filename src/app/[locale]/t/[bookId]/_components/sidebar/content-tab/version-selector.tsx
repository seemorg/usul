"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/navigation";
import type { BookVersion } from "@/types";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

const idToName: Record<string, string> = {
  Shamela: "al-Maktaba al-Shāmila",
  Sham19Y: "al-Maktaba al-Shāmila (2019 additions)",
  JK: "al-Jāmiʿ al-kabīr",
  Shia: "al-Maktaba al-Shīʿiyya",
  ShamAY: "Special Shamela",
  Zaydiyya: "al-Maktaba al-Shāmila al-Zaydiyya",
  ShamIbadiyya: "al-Maktaba al-Shāmila al-Ibāḍiyya",
  GRAR: "Graeco-Arabic Studies Corpus",
  Tafsir: "al-Tafāsīr",
  Sham30K: "al-Maktaba al-Shāmila (30.000 texts)",
  Filaha: "The Filāḥa Project",
  Hindawi: "Hindawi",
  BibleCorpus: "Bible Corpus",
};

export default function VersionSelector({
  versions,
}: {
  versions: BookVersion[];
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { replace } = useRouter();
  const t = useTranslations("reader");

  const [selectedVersion, setSelectedVersion] = useState(() => {
    const versionInUrl = params.get("version");

    const version = versionInUrl
      ? versions.find((v) => v.value === versionInUrl)?.value ??
        versions[0]?.value
      : versions[0]?.value;

    return version;
  });
  const selectedVersionObj = versions.find((v) => v.value === selectedVersion);

  const handleVersionChange = (newVersion: string) => {
    setSelectedVersion(newVersion);

    const newUrl =
      newVersion === versions[0]?.value
        ? pathname
        : `${pathname}?version=${newVersion}`;

    startTransition(() => {
      replace(newUrl);
    });
  };

  const versionIdToName = (versionId: string) => {
    const parts = versionId.split(".");
    const name = parts[parts.length - 1]?.split("-")[0]?.replace("Vols", "");

    // remove numbers at the end
    if (name) {
      const id = name.replace(/\d+$/, "");
      return idToName[id] ?? id;
    }

    return name;
  };

  const versionToName = (version: BookVersion) => {
    if (version.source === "turath") {
      return "Turath";
    }

    return versionIdToName(version.value);
  };

  return (
    <Select value={selectedVersion} onValueChange={handleVersionChange}>
      <SelectTrigger
        className="w-[300px] max-w-full overflow-hidden [&>span]:min-w-0 [&>span]:max-w-[90%] [&>span]:overflow-ellipsis [&>span]:break-words"
        id="version-selector"
        isLoading={isPending}
      >
        {selectedVersionObj ? (
          versionToName(selectedVersionObj)
        ) : (
          <SelectValue placeholder={t("select-version")} />
        )}
      </SelectTrigger>

      <SelectContent>
        {versions.map((version, idx) => (
          <SelectItem key={idx} value={version.value}>
            {versionToName(version)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
