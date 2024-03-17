"use client";

import { Logo } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import SearchBar from "./search";
import { useNavbarStore } from "@/stores/navbar";
import { useReaderScroller } from "../../[locale]/t/[bookId]/_components/context";
import HomepageNavigationMenu from "./navigation-menu";
import LocaleSwitcher from "./locale-switcher";

interface ReaderNavbarProps {
  sidebarContent?: React.ReactNode;
  isHomepage?: boolean;
}

export default function Navbar({
  isHomepage,
  sidebarContent,
}: ReaderNavbarProps) {
  const { showNavbar, setShowNavbar } = useNavbarStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerEl = useReaderScroller();

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
          "fixed right-0 top-0 z-30 flex h-16 w-full items-center justify-between gap-4 bg-primary px-4 text-white transition sm:gap-8 lg:h-20 lg:pl-10 xl:grid xl:grid-cols-12",
          showNavbar
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-10 opacity-0",
        )}
      >
        <div className="xl:col-span-2">
          <Link href="/">
            <Logo className="-mt-1 h-[2.3rem] w-auto lg:h-12" />
          </Link>
        </div>

        {isHomepage ? (
          <div className="hidden min-w-0 flex-1 items-center px-4 py-4 md:mx-auto md:max-w-3xl md:px-8 lg:mx-0 lg:flex lg:max-w-none lg:justify-center xl:col-span-8 xl:px-0">
            <HomepageNavigationMenu />
          </div>
        ) : (
          <div className="hidden min-w-0 flex-1 items-center px-4 py-4 md:mx-auto md:max-w-3xl md:px-8 lg:mx-0 lg:flex lg:max-w-none xl:col-span-8 xl:px-0">
            <SearchBar />
          </div>
        )}

        <div className="flex items-center gap-3 lg:hidden">
          {/* Mobile menu button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setIsMenuOpen(false);
              setIsSearchOpen(!isSearchOpen);
            }}
          >
            <MagnifyingGlassIcon className="block h-6 w-6" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="relative"
            onClick={() => {
              setIsSearchOpen(false);
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <span className="absolute -inset-0.5" />
            <span className="sr-only">Open menu</span>
            {isMenuOpen ? (
              <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        </div>

        <div className="hidden lg:flex lg:items-center lg:justify-end lg:gap-3 xl:col-span-2">
          <ThemeToggle />

          <LocaleSwitcher />
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed left-0 right-0 top-0 z-[10] pt-10 lg:hidden">
          {sidebarContent}
        </div>
      )}

      {isSearchOpen && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-[10] h-screen bg-gray-50 pt-20 lg:hidden">
          <SearchBar autoFocus />
        </div>
      )}
    </>
  );
}
