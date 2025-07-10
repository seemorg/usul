"use client";

import { useEffect, useState } from "react";
import { ArabicLogo, Logo } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/lib/locale/utils";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { useNavbarStore } from "@/stores/navbar";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

import { useReaderScroller } from "../../[locale]/t/[bookId]/_components/context";
import LocaleSwitcher from "./locale-switcher";
import MobileMenu from "./mobile-menu";
import MobileNavigationMenu from "./mobile-navigation-menu";
import HomepageNavigationMenu from "./navigation-menu";
import { ProfileDropdown } from "./profile-dropdown";
import SearchBar from "./search-bar";
import { ThemeToggle } from "./theme-toggle";

interface NavbarProps {
  layout?: "home" | "reader";
  secondNav?: React.ReactNode;
}

export default function Navbar({ layout, secondNav }: NavbarProps) {
  const { showNavbar, setShowNavbar, showSearch, setShowSearch } =
    useNavbarStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const containerEl = useReaderScroller();
  const dir = useDirection();

  useEffect(() => {
    let oldValue = 0;
    let newValue = 0;

    const container = containerEl?.element;

    if (!container) return;

    const handleScroll = () => {
      // Get the new Value
      newValue = container.scrollTop || 0;

      //Subtract the two and conclude
      if (newValue <= 100) setShowNavbar(true);
      else if (oldValue - newValue < 0) setShowNavbar(false);
      else if (oldValue - newValue > 0 && newValue > 120) setShowNavbar(true);

      // Update the old value
      oldValue = newValue;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => container.removeEventListener("scroll", handleScroll);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerEl]);

  return (
    <>
      <header
        className={cn(
          layout === "reader" ? "relative" : "fixed",
          "bg-muted-primary top-0 z-41 flex h-16 w-full items-center justify-between gap-4 px-4 text-white transition duration-250 sm:gap-8 lg:grid lg:h-20 lg:grid-cols-12 lg:px-10",
          showNavbar
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-10 opacity-0",
        )}
      >
        <div className="lg:col-span-2">
          <Link
            href="/"
            className="flex w-fit items-center gap-3"
            onNavigate={() => setIsMenuOpen(false)}
          >
            {dir === "ltr" ? (
              <Logo className="h-5 w-auto" />
            ) : (
              <ArabicLogo className="h-8 w-auto" />
            )}
          </Link>
        </div>

        {layout === "home" ? (
          <div className="hidden min-w-0 flex-1 items-center px-4 py-4 lg:col-span-8 lg:flex lg:max-w-none lg:justify-center lg:px-0">
            <HomepageNavigationMenu />
          </div>
        ) : (
          <div className="hidden min-w-0 flex-1 items-center px-4 py-4 lg:col-span-8 lg:mx-0 lg:flex lg:max-w-none lg:px-0">
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
                setShowSearch(!showSearch);
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
              setShowSearch(false);
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

        <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-end lg:gap-3">
          <LocaleSwitcher />
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </header>

      {secondNav && (
        <nav
          className={cn(
            "fixed inset-x-0 top-16 z-30 w-full transition duration-250",
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
          <MobileNavigationMenu setIsMenuOpen={setIsMenuOpen} />
        </MobileMenu>
      )}
    </>
  );
}
