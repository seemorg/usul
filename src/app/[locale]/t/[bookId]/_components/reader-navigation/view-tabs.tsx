"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";

{
  /* <Button
variant={view === "pdf" ? "default" : "secondary"}
onClick={onViewClick}
className="w-full flex-1 gap-2 hover:opacity-80"
disabled={!pdf?.finalUrl}
>
{view === "pdf" ? (
  <XIcon className="h-4 w-4" />
) : (
  <FileTextIcon className="h-4 w-4" />
)}

{!pdf?.finalUrl
  ? "No PDF Attached"
  : view === "pdf"
    ? "Exit PDF"
    : "View PDF"}
</Button> */
}

export default function ViewTabs({ hasPdf }: { hasPdf?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const router = useRouter();

  const onViewClick = (clickedView: "pdf" | "ebook") => {
    if (clickedView === view) return;

    const newParams = new URLSearchParams(searchParams);
    if (clickedView === "ebook") {
      newParams.delete("view");
    } else {
      newParams.set("view", "pdf");
    }

    router.replace(`${pathname}?${newParams.toString()}`);
  };

  return (
    <Tabs
      defaultValue="ebook"
      value={view === "pdf" ? "pdf" : "ebook"}
      onValueChange={onViewClick as any}
    >
      <TabsList>
        <TabsTrigger value="ebook">e-Book</TabsTrigger>
        <TabsTrigger value="pdf" disabled={!hasPdf}>
          PDF
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
