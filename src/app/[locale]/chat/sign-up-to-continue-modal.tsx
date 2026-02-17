"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/urls";

import Avatar from "./avatar";

/** Shared sign-up button/link for modal and in-chat prompt */
function SignUpToContinueContent({
  onLinkClick,
}: {
  onLinkClick?: () => void;
}) {
  const t = useTranslations("chat");

  return (
    <Button asChild>
      <Link href={navigation.login()} onClick={onLinkClick}>
        {t("signUpToContinue.signUp")}
      </Link>
    </Button>
  );
}

export function SignUpToContinueModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("chat");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("signUpToContinue.title")}</DialogTitle>
        </DialogHeader>
        <div className="pt-2">
          <SignUpToContinueContent onLinkClick={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** In-chat message variant: prompt shown in the message thread */
export function SignUpToContinueMessage() {
  const t = useTranslations("chat");

  return (
    <div
      data-testid="sign-up-to-continue-message"
      className="mx-auto w-full max-w-3xl px-5"
      data-role="assistant"
    >
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-4">
        <Avatar />
        <div className="bg-muted/50 flex w-full flex-col gap-3 rounded-2xl border p-4 sm:p-5">
          <p className="text-foreground text-sm">{t("signUpToContinue.title")}</p>
          <SignUpToContinueContent />
        </div>
      </div>
    </div>
  );
}
