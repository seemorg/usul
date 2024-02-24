"use client";

import { Logo } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { MagnifyingGlassIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { LanguageIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./navbar/theme-toggle";

interface ReaderNavbarProps {
  contentContainerRef: React.RefObject<HTMLDivElement>;
}

export default function ReaderNavbar({
  contentContainerRef,
}: ReaderNavbarProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let oldValue = 0;
    let newValue = 0;

    const container = contentContainerRef.current;

    const handleScroll = () => {
      // Get the new Value
      newValue = container?.scrollTop || 0;

      //Subtract the two and conclude
      if (newValue <= 100) setShow(true);
      else if (oldValue - newValue < 0) setShow(false);
      else if (oldValue - newValue > 0 && newValue > 120) setShow(true);

      // Update the old value
      oldValue = newValue;
    };

    container?.addEventListener("scroll", handleScroll, { passive: true });

    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-20 w-full items-center justify-between gap-8 bg-primary px-4 text-white transition lg:pl-10 xl:grid xl:grid-cols-12",
        show
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-10 opacity-0",
      )}
    >
      <div className="xl:col-span-2">
        <Link href="/">
          <Logo className="-mt-1 h-12 w-auto" />
        </Link>
      </div>

      <div className="min-w-0 flex-1 md:px-8 xl:col-span-8">
        <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
          <div className="w-full">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full rounded-md border-0 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary sm:text-sm sm:leading-6"
                placeholder="Search"
                type="search"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center lg:hidden">
        {/* Mobile menu button */}
        <Button size="icon" variant="ghost" className="relative">
          <span className="absolute -inset-0.5" />
          <span className="sr-only">Open menu</span>
          {/* {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : ( */}
          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
          {/* )} */}
        </Button>
      </div>

      <div className="hidden lg:flex lg:items-center lg:justify-end lg:gap-3 xl:col-span-2">
        <ThemeToggle />

        <Button size="icon" variant="ghost">
          <LanguageIcon className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}
