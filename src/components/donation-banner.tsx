"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function DonationBanner() {
  const t = useTranslations();
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set CSS variable for banner height so navbar can adjust
    if (bannerRef.current) {
      const height = bannerRef.current.offsetHeight;
      document.documentElement.style.setProperty(
        "--donation-banner-height",
        `${height}px`,
      );
    }
  }, []);

  return (
    <div ref={bannerRef} className="fixed top-0 left-0 right-0 z-50 w-full">
      <Alert
        variant="primary"
        className="rounded-none flex flex-col sm:flex-row items-center sm:gap-8 justify-center border-x-0 border-t-0 bg-collection-green text-white py-1 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:top-1.5"
      >
        <AlertTitle className="mb-0 text font-bold leading-tight">
          {t("common.donation.title")}
        </AlertTitle>
        <Link href="/donate">
          <AlertDescription className="mb-0 text underline leading-tight">
            {t("common.donation.message")}
          </AlertDescription>
        </Link>
      </Alert>
    </div>
  );
}
