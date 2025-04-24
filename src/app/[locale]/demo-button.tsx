"use client";

import { Button } from "@/components/ui/button";
import { useDemo } from "../_components/video-modal/provider";

export const DemoButton = ({ children }: { children: React.ReactNode }) => {
  const setDemo = useDemo((s) => s.setIsOpen);

  return (
    <Button
      variant="ghost"
      className="bg-accent/10 dark:bg-accent hover:bg-accent/20 dark:hover:bg-accent/80 focus:bg-accent/20 h-10 gap-2 px-4 py-3"
      onClick={() => setDemo(true)}
    >
      {children}
    </Button>
  );
};
