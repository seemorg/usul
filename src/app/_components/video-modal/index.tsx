import Plyr from "plyr-react";
import "plyr-react/plyr.css";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import {
//   getLocaleFullName,
//   pathLocaleToAppLocale,
//   usePathLocale,
// } from "@/lib/locale/utils";

export default function VideoModal() {
  // const pathLocale = usePathLocale();
  // const [activeLanguage, setActiveLanguage] = useState<"ar" | "en">(
  //   pathLocale === "ar" ? "ar" : "en",
  // );

  return (
    <>
      {/* <div className="flex items-center gap-3">
        <Button
          variant={activeLanguage === "en" ? "default" : "outline"}
          onClick={() => setActiveLanguage("en")}
        >
          {getLocaleFullName(pathLocaleToAppLocale("en")!)}
        </Button>

        <Button
          variant={activeLanguage === "ar" ? "default" : "outline"}
          onClick={() => setActiveLanguage("ar")}
        >
          {getLocaleFullName(pathLocaleToAppLocale("ar")!)}
        </Button>
      </div> */}

      <div className="mt-5">
        <Plyr
          // autoPlay
          options={{ autoplay: true }}
          source={{
            type: "video",
            sources: [
              // {
              //   provider: "youtube",
              //   src: "nqye02H_H6I",
              // },
              {
                provider: "html5",
                src: "https://assets.usul.ai/usul%20beta.mp4",
              },
            ],
          }}
        />
      </div>
    </>
  );
}
