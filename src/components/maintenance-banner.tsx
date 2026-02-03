"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

export default function MaintenanceBanner() {
  const t = useTranslations();
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set CSS variable for banner height so navbar can adjust
    if (bannerRef.current) {
      const height = bannerRef.current.offsetHeight;
      document.documentElement.style.setProperty(
        "--maintenance-banner-height",
        `${height}px`,
      );
    }
  }, []);

  return (
    <div ref={bannerRef} className="fixed top-0 left-0 right-0 z-50 w-full">
      <Alert
        variant="primary"
        className="rounded-none flex border-x-0 border-t-0 bg-yellow-500 text-black py-1 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:top-1.5"
      >
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle className="mb-0 text-xs leading-tight">
          {t("common.maintenance.title")}
        </AlertTitle>
        <AlertDescription className="text-xs leading-tight">
          {t("common.maintenance.message")}
        </AlertDescription>
      </Alert>
    </div>
  );
}
