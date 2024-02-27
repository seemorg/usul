"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function VersionSelector({
  versionIds,
}: {
  versionIds: string[];
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { replace } = useRouter();

  const [selectedVersion, setSelectedVersion] = useState(() => {
    const versionInUrl = params.get("version");

    if (versionInUrl && versionIds.includes(versionInUrl)) {
      return versionInUrl;
    }

    return versionIds[0];
  });

  const handleVersionChange = (newVersion: string) => {
    setSelectedVersion(newVersion);

    const newUrl =
      newVersion === versionIds[0]
        ? pathname
        : `${pathname}?version=${newVersion}`;

    startTransition(() => {
      replace(newUrl);
    });
  };

  return (
    <Select value={selectedVersion} onValueChange={handleVersionChange}>
      <SelectTrigger
        className="w-[300px] max-w-full overflow-hidden [&>span]:min-w-0 [&>span]:max-w-[90%] [&>span]:overflow-ellipsis [&>span]:break-words"
        id="version-selector"
        isLoading={isPending}
      >
        <SelectValue placeholder="Select a version" />
      </SelectTrigger>

      <SelectContent>
        {versionIds.map((version, idx) => (
          <SelectItem key={idx} value={version}>
            {version}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
