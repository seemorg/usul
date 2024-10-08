"use client";

import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales } from "~/i18n.config";
import { Link, usePathname } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { getLocaleFullName } from "@/lib/locale/utils";
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
          className="gap-1"
          dir={selectedLocale === "ar-SA" ? "ltr" : "rtl"}
          // onMouseEnter={() => setOpen(true)}
          // onMouseLeave={() => setOpen(false)}
        >
          {/* <LanguageIcon className="h-4 w-4" /> */}
          {getLocaleFullName(selectedLocale === "ar-SA" ? "en-US" : "ar-SA")}
          <ChevronDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <Link href={currentUrl} key={locale} locale={locale as any}>
            <DropdownMenuCheckboxItem checked={selectedLocale === locale}>
              {getLocaleFullName(locale)}
            </DropdownMenuCheckboxItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
