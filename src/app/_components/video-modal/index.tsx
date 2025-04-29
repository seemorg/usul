"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDemo } from "@/stores/demo";

// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import {
//   getLocaleFullName,
//   pathLocaleToAppLocale,
//   usePathLocale,
// } from "@/lib/locale/utils";

export default function DemoModalProvider() {
  const { isOpen, setIsOpen } = useDemo();

  // const pathLocale = usePathLocale();
  // const [activeLanguage, setActiveLanguage] = useState<"ar" | "en">(
  //   pathLocale === "ar" ? "ar" : "en",
  // );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl">
        <DialogTitle className="text-2xl">Usul Demo</DialogTitle>
        <DialogDescription>This is a demo of the Usul app.</DialogDescription>
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
          <video
            // autoPlay
            src="https://assets.usul.ai/usul%20beta.mp4"
            className="w-full"
            controls
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
