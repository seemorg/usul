"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeToEnglishName, routing } from "@/i18n/config";
import { getLocaleFullName } from "@/lib/locale/utils";
import { Link, usePathname } from "@/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useLocale } from "next-intl";

export default function LocaleSwitcher() {
  const selectedLocale = useLocale();
  const pathname = usePathname();

  const params = useSearchParams();

  const currentUrl = `${pathname}${params.size > 0 ? `?` + params.toString() : ""}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="shrink-0 gap-1"
          suppressHydrationWarning
        >
          {/* <LanguageIcon className="h-4 w-4" /> */}
          {getLocaleFullName(selectedLocale)}
          <ChevronDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {routing.locales.map((locale) => (
          <Link
            href={currentUrl}
            key={locale}
            locale={locale}
            title={localeToEnglishName[locale]}
          >
            <DropdownMenuCheckboxItem checked={selectedLocale === locale}>
              {getLocaleFullName(locale)}
            </DropdownMenuCheckboxItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
