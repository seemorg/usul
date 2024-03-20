"use client";

import { Button } from "@/components/ui/button";
import { LanguageIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales } from "~/i18n.config";
import { Link, usePathname } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { getLocaleFullName } from "@/lib/locale/client";
import { useLocale } from "next-intl";

export default function LocaleSwitcher() {
  const selectedLocale = useLocale();
  const pathname = usePathname();
  const params = useSearchParams();

  const currentUrl = `${pathname}${params.size > 0 ? `?` + params.toString() : ""}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <LanguageIcon className="h-6 w-6" />
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
