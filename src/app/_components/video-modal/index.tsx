"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLocaleFullName, usePathLocale } from "@/lib/locale/utils";
import { useDemo } from "@/stores/demo";
import { useTranslations } from "next-intl";

const videos = {
  en: "https://assets.usul.ai/usul-demos:english.mp4",
  ar: "https://assets.usul.ai/usul-demos:arabic.mp4",
};

export default function DemoModalProvider() {
  const { isOpen, setIsOpen } = useDemo();
  const t = useTranslations("common");
  const pathLocale = usePathLocale();
  const [activeLanguage, setActiveLanguage] = useState<"ar" | "en">(
    pathLocale === "ar" ? "ar" : "en",
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("demo.title")}</DialogTitle>
          <DialogDescription>{t("demo.description")}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <Button
            variant={activeLanguage === "en" ? "default" : "outline"}
            onClick={() => setActiveLanguage("en")}
          >
            {getLocaleFullName("en-US")}
          </Button>

          <Button
            variant={activeLanguage === "ar" ? "default" : "outline"}
            onClick={() => setActiveLanguage("ar")}
          >
            {getLocaleFullName("ar-SA")}
          </Button>
        </div>

        <div className="mt-5">
          <video
            autoPlay
            src={videos[activeLanguage]}
            className="w-full"
            controls
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
