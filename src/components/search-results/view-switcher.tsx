"use client";

import { LayoutGridIcon, Rows3Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/navigation";

export default function ViewSwitcher() {
  const params = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const _view = params.get("view");
  const view = _view ? (_view === "grid" ? "grid" : "list") : "grid";

  const toggleView = () => {
    const newView = view === "grid" ? "list" : "grid";

    const newUrlParams = new URLSearchParams(params);
    newUrlParams.set("view", newView);

    replace(`${pathname}?${newUrlParams.toString()}`);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10"
      onClick={toggleView}
      tooltip={`Switch to ${view === "list" ? "grid" : "list"} view`}
      tooltipProps={{ side: "bottom" }}
    >
      {view === "list" ? (
        <Rows3Icon className="h-5 w-5" />
      ) : (
        <LayoutGridIcon className="h-5 w-5" />
      )}
    </Button>
  );
}
