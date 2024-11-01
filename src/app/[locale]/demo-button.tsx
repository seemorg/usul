"use client";

import { Button } from "@/components/ui/button";
import { useDemo } from "../_components/video-modal/provider";

export const DemoButton = ({ children }: { children: React.ReactNode }) => {
  const setDemo = useDemo((s) => s.setIsOpen);

  return (
    <Button
      variant="ghost"
      className="h-10 gap-2 bg-accent/10 px-4 py-3 hover:bg-accent/20 focus:bg-accent/20"
      onClick={() => setDemo(true)}
    >
      {children}
    </Button>
  );
};
