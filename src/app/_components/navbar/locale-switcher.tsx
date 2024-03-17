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
import { usePathname, useRouter } from "@/navigation";
import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { getLocaleFullName } from "@/lib/locale";

export default function LocaleSwitcher() {
  const selectedLocale = useLocale();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setLocale = (locale: string) => {
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { locale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" disabled={isPending}>
          <LanguageIcon className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" defaultValue={selectedLocale}>
        {locales.map((locale) => (
          <DropdownMenuCheckboxItem
            key={locale}
            onClick={() => setLocale(locale)}
          >
            {getLocaleFullName(locale)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
