"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function DonationBanner() {
  const t = useTranslations();
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;

    const updateHeight = () => {
      const height = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty(
        "--donation-banner-height",
        `${height}px`,
      );
    };

    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    updateHeight();

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={bannerRef} className="fixed top-0 left-0 right-0 z-50 w-full">
      <Alert
        variant="primary"
        className="rounded-none flex flex-col sm:flex-row items-center sm:gap-8 justify-center border-0 bg-collection-green text-white py-1 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:top-1.5"
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
