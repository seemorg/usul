"use client";

import { ArabicLogo, Logo } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowLeftIcon,
} from "@heroicons/react/20/solid";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { useNavbarStore } from "@/stores/navbar";
import { useReaderScroller } from "../../[locale]/t/[bookId]/_components/context";
import SearchBar from "./search-bar";
import HomepageNavigationMenu from "./navigation-menu";
import LocaleSwitcher from "./locale-switcher";
import MobileMenu from "./mobile-menu";
import MobileNavigationMenu from "./mobile-navigation-menu";
import { useTranslations } from "next-intl";
import { useDirection } from "@/lib/locale/utils";

interface NavbarProps {
  layout?: "home" | "reader";
  secondNav?: React.ReactNode;
}

export default function Navbar({ layout, secondNav }: NavbarProps) {
  const t = useTranslations();
  const { showNavbar, setShowNavbar } = useNavbarStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerEl = useReaderScroller();
  const dir = useDirection();

  useEffect(() => {
    let oldValue = 0;
    let newValue = 0;

    const container = containerEl?.element;

    if (!container) return;

    const handleScroll = () => {
      // Get the new Value
      newValue = container?.scrollTop || 0;

      //Subtract the two and conclude
      if (newValue <= 100) setShowNavbar(true);
      else if (oldValue - newValue < 0) setShowNavbar(false);
      else if (oldValue - newValue > 0 && newValue > 120) setShowNavbar(true);

      // Update the old value
      oldValue = newValue;
    };

    container?.addEventListener("scroll", handleScroll, { passive: true });

    return () => container?.removeEventListener("scroll", handleScroll);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerEl]);

  return (
    <>
      <header
        className={cn(
          layout === "reader" ? "relative" : "fixed",
          "top-0 z-41 flex h-16 w-full items-center justify-between gap-4 bg-muted-primary px-4 text-white transition sm:gap-8 lg:h-20 lg:px-10 xl:grid xl:grid-cols-12",
          showNavbar
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-10 opacity-0",
        )}
      >
        <div className="xl:col-span-2">
          <Link href="/" className="flex w-fit items-center gap-3">
            {dir === "ltr" ? (
              <Logo className="h-5 w-auto" />
            ) : (
              <ArabicLogo className="h-8 w-auto" />
            )}
          </Link>
        </div>

        {layout === "home" ? (
          <div className="hidden min-w-0 flex-1 items-center px-4 py-4 md:mx-auto md:max-w-3xl md:px-8 lg:mx-0 lg:flex lg:max-w-none lg:justify-center xl:col-span-8 xl:px-0">
            <HomepageNavigationMenu />
          </div>
        ) : (
          <div className="hidden min-w-0 flex-1 items-center px-4 py-4 md:mx-auto md:max-w-3xl md:px-8 lg:mx-0 lg:flex lg:max-w-none xl:col-span-8 xl:px-0">
            <SearchBar />
          </div>
        )}

        <div className="flex items-center gap-1 sm:gap-3 lg:hidden">
          <ThemeToggle />
          <LocaleSwitcher />

          {layout !== "home" && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setIsMenuOpen(false);
                setIsSearchOpen(!isSearchOpen);
              }}
            >
              <MagnifyingGlassIcon className="block h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          )}

          {/* Mobile menu button */}
          <Button
            size="icon"
            variant="ghost"
            className="relative"
            onClick={() => {
              setIsSearchOpen(false);
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <span className="sr-only">Open menu</span>

            {isMenuOpen ? (
              <XMarkIcon
                className="block h-5 w-5 sm:h-6 sm:w-6"
                aria-hidden="true"
              />
            ) : (
              <Bars3Icon
                className="block h-5 w-5 sm:h-6 sm:w-6"
                aria-hidden="true"
              />
            )}
          </Button>
        </div>

        <div className="hidden lg:flex lg:items-center lg:justify-end lg:gap-3 xl:col-span-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {secondNav && (
        <nav
          className={cn(
            "fixed inset-x-0 top-16 z-30 w-full transition",
            showNavbar
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-10 opacity-0",
          )}
        >
          {secondNav}
        </nav>
      )}

      {isMenuOpen && (
        <MobileMenu>
          <MobileNavigationMenu />
        </MobileMenu>
      )}

      {isSearchOpen && (
        <MobileMenu className="z-42 pt-10">
          <div className="absolute top-4 flex items-center gap-2 ltr:left-2 rtl:right-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsSearchOpen(false)}
            >
              <ArrowLeftIcon className="block h-5 w-5 rtl:rotate-180" />
            </Button>

            <h1 className="text-lg font-semibold">{t("common.search")}</h1>
          </div>

          <div className="mt-8">
            <SearchBar autoFocus mobile />
          </div>
        </MobileMenu>
      )}
    </>
  );
}
