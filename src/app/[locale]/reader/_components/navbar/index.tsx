"use client";

import { Logo } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { LanguageIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import SearchBar from "./search";

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-20 w-full items-center justify-between gap-4 bg-primary px-4 text-white transition sm:gap-8 lg:pl-10 xl:grid xl:grid-cols-12",
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

      <div className="flex min-w-0 flex-1 items-center px-4 py-4 md:mx-auto md:max-w-3xl md:px-8 lg:mx-0 lg:max-w-none xl:col-span-8 xl:px-0">
        <SearchBar />
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
