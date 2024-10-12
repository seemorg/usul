"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { create } from "zustand";

const VideoModal = dynamic(() => import("./index"), { ssr: false });

export default function DemoModalProvider() {
  const { isOpen, setIsOpen } = useDemo();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[1200px]">
        <VideoModal />
      </DialogContent>
    </Dialog>
  );
}

export const useDemo = create<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>()((set) => ({ isOpen: false, setIsOpen: (isOpen) => set({ isOpen }) }));
