"use client";

import Container from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { useNavbarStore } from "@/stores/navbar";
import VersionSelector from "./content-tab/version-selector";
import type { ApiBookResponse } from "@/types/ApiBookResponse";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DownloadIcon, ExpandIcon } from "lucide-react";

export default function ReaderNavigation({
  bookResponse,
}: {
  bookResponse: ApiBookResponse;
}) {
  const showNavbar = useNavbarStore((s) => s.showNavbar);

  return (
    <div
      className={cn(
        "relative z-[10] w-full border-b border-border bg-white py-3 transition-transform will-change-transform",
        showNavbar ? "translate-y-20" : "translate-y-0",
      )}
    >
      <Container className="flex w-full items-center justify-between">
        <VersionSelector
          versions={bookResponse.book.versions}
          versionId={bookResponse.content.versionId}
        />

        <Tabs defaultValue="ebook">
          <TabsList>
            <TabsTrigger value="ebook">e-Book</TabsTrigger>
            <TabsTrigger value="pdf">PDF</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <Button size="icon" variant="outline">
            <DownloadIcon className="size-4" />
          </Button>

          <Button size="icon" variant="outline">
            <ExpandIcon className="size-4" />
          </Button>
        </div>
      </Container>
    </div>
  );
}
