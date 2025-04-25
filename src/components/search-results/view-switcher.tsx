"use client";

import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/navigation";
import { LayoutGridIcon, Rows3Icon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "../ui/button";

const defaultView = "list";

export default function ViewSwitcher() {
  const params = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const t = useTranslations("common.views");

  const _view = params.get("view");
  const view = _view ? (_view === "grid" ? "grid" : "list") : defaultView;

  const toggleView = () => {
    const newView = view === "grid" ? "list" : "grid";

    const newUrlParams = new URLSearchParams(params);

    if (newView === defaultView) {
      newUrlParams.delete("view");
    } else {
      newUrlParams.set("view", newView);
    }

    replace(`${pathname}?${newUrlParams.toString()}`);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10"
      onClick={toggleView}
      tooltip={t(view === "list" ? "switch-to-grid" : "switch-to-list")}
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
