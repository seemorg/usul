"use client";

import { Button } from "@/components/ui/button";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { useDemo } from "../_components/video-modal/provider";

export const DemoButton = () => {
  const t = useTranslations("home");
  const setDemo = useDemo((s) => s.setIsOpen);

  return (
    <Button
      variant="ghost"
      className="h-10 gap-2 bg-accent/10 px-4 py-3 hover:bg-accent/20 focus:bg-accent/20"
      onClick={() => setDemo(true)}
    >
      <PlayIcon className="size-4" />
      {t("how-usul-works")} - 2:40
    </Button>
  );
};
