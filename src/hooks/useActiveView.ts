"use client";

import { useSearchParams } from "next/navigation";

export const useActiveView = () => {
  const params = useSearchParams();

  const _view = params.get("view");
  const view = _view ? (_view === "grid" ? "grid" : "list") : "list";

  return view;
};
