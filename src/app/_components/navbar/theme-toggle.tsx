"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <SunIcon className="h-5 w-5 rotate-90 scale-0 transition-all sm:h-6 sm:w-6 dark:-rotate-0 dark:scale-100" />

      <MoonIcon className="absolute h-5 w-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
