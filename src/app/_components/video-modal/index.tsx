"use client";

import { Button } from "@/components/ui/button";

import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import { useState } from "react";
import {
  getLocaleFullName,
  pathLocaleToSupportedBcp47Locale,
  usePathLocale,
} from "@/lib/locale/utils";

export default function VideoModal() {
  const pathLocale = usePathLocale();
  const [activeLanguage, setActiveLanguage] = useState<"ar" | "en">(
    pathLocale === "ar" ? "ar" : "en",
  );

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          variant={activeLanguage === "en" ? "default" : "outline"}
          onClick={() => setActiveLanguage("en")}
        >
          {getLocaleFullName(pathLocaleToSupportedBcp47Locale("en")!)}
        </Button>

        <Button
          variant={activeLanguage === "ar" ? "default" : "outline"}
          onClick={() => setActiveLanguage("ar")}
        >
          {getLocaleFullName(pathLocaleToSupportedBcp47Locale("ar")!)}
        </Button>
      </div>

      <div className="mt-5">
        <Plyr
          source={{
            type: "video",
            sources: [
              {
                provider: "youtube",
                src: "nqye02H_H6I",
              },
            ],
          }}
        />
      </div>
    </>
  );
}
