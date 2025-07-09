"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface DeleteConfirmationProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => void;
  className?: string;
}

export function DeleteConfirmation({
  isOpen,
  setIsOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText,
  onConfirm,
  className,
}: DeleteConfirmationProps) {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
    setInputValue("");
  };

  const isConfirmDisabled = confirmText ? inputValue !== confirmText : false;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {confirmText && (
          <div className="py-4">
            <p className="text-muted-foreground mb-2 text-sm">
              Please type <span className="font-semibold">{confirmText}</span>{" "}
              to confirm
            </p>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmText}
            />
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setInputValue("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
