"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="shrink-0"
    >
      <SunIcon className="h-5 w-5 scale-0 rotate-90 transition-all sm:h-6 sm:w-6 dark:scale-100 dark:-rotate-0" />

      <MoonIcon className="absolute h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:rotate-90" />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
