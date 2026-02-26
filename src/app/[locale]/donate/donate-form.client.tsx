"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth";
import { navigation } from "@/lib/urls";
import {
  createCheckoutSessionForAuthenticatedUser,
  createCheckoutSessionForGuest,
} from "@/server/services/donations";
import { useMutation } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";

import BentoCard from "./bento-card";

type Frequency = "one-time" | "monthly" | "yearly";
const presetAmounts = [25, 50, 100, 500];

function DonateForm({ layout }: { layout?: "hero" }) {
  const t = useTranslations("donate");
  const formatter = useFormatter();
  const { data: session } = useSession();
  const [frequency, setFrequency] = useState<Frequency>("one-time");
  const [amount, setAmount] = useState<number>(100);
  const [showGuestEmail, setShowGuestEmail] = useState(false);
  const [showSignInRecurring, setShowSignInRecurring] = useState(false);

  const isLoggedIn = Boolean(session?.user.email);

  const { mutateAsync: createAuthenticatedCheckout, isPending: isAuthPending } =
    useMutation({
      mutationFn: (data: {
        amount: number;
        frequency: Frequency;
        clientEmail?: string;
      }) =>
        createCheckoutSessionForAuthenticatedUser(
          data.amount,
          data.frequency,
          data.clientEmail,
        ),
      onError: () => {
        toast.error("Failed to create checkout");
      },
    });

  const { mutateAsync: createGuestCheckout, isPending: isGuestPending } =
    useMutation({
      mutationFn: (data: { email: string; amount: number }) =>
        createCheckoutSessionForGuest(data.email, data.amount),
      onError: () => {
        toast.error("Failed to create checkout");
      },
    });

  const isPending = isAuthPending || isGuestPending;

  const formatCurrency = (amount: number) =>
    formatter.number(amount, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const handleContinue = async () => {
    if (isLoggedIn) {
      const url = await createAuthenticatedCheckout({
        amount,
        frequency,
        clientEmail: session?.user?.email,
      });
      if (url) window.location.href = url;
      return;
    }

    if (frequency === "one-time") {
      setShowGuestEmail(true);
      return;
    }

    setShowSignInRecurring(true);
  };

  const handleGuestCheckout = async (email: string) => {
    const url = await createGuestCheckout({ email, amount });
    if (url) window.location.href = url;
  };

  return (
    <BentoCard
      className={cn(
        "flex-1 p-8",
        layout === "hero" &&
          "text-foreground translate-y-[30%] shadow-xl shadow-black/5 lg:translate-y-0",
      )}
      id={layout === "hero" ? "donate-form-hero" : "donate-form"}
    >
      {layout !== "hero" && (
        <h3 className="text-3xl font-semibold">
          {t("be-part.choose-amount.title")}
        </h3>
      )}

      <Tabs
        value={frequency}
        onValueChange={(value) => setFrequency(value as Frequency)}
      >
        <TabsList className={cn(layout !== "hero" && "mt-5")}>
          <TabsTrigger value="one-time">
            {t("be-part.choose-amount.interval.one-time")}
          </TabsTrigger>
          <TabsTrigger value="monthly">
            {t("be-part.choose-amount.interval.monthly")}
          </TabsTrigger>
          <TabsTrigger value="yearly">
            {t("be-part.choose-amount.interval.yearly")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div
        className={cn(
          "mt-5 flex flex-col justify-between gap-3",
          layout !== "hero" && "sm:flex-row sm:items-center",
        )}
      >
        <div className="flex items-center gap-3">
          {presetAmounts.map((presetAmount) => (
            <Button
              key={presetAmount}
              variant={amount === presetAmount ? "default" : "outline"}
              className={cn(
                "shadow-none",
                amount === presetAmount && "border border-transparent",
                layout === "hero" && "w-full",
              )}
              onClick={() => setAmount(presetAmount)}
            >
              {formatCurrency(presetAmount)}
            </Button>
          ))}
        </div>

        <div className="border-border flex items-center rounded-md border">
          <label
            className="border-border border-r px-3 text-center text-sm"
            htmlFor="other-amount"
          >
            USD
          </label>
          <Input
            id="other-amount"
            placeholder="Other Amount"
            type="number"
            className={cn(
              "border-none shadow-none ltr:pl-2 rtl:pr-2",
              layout !== "hero" && "min-w-[130px]",
            )}
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
      </div>

      <p className="mt-5 text-xs">{t("be-part.choose-amount.note")}</p>

      <Button
        className="mt-8 h-12 w-full text-base font-bold"
        size="lg"
        onClick={handleContinue}
        disabled={isPending}
      >
        {isPending ? "Loading..." : t("be-part.choose-amount.continue")}
      </Button>

      <GuestEmailModal
        open={showGuestEmail}
        onClose={() => setShowGuestEmail(false)}
        onSubmit={handleGuestCheckout}
        isPending={isGuestPending}
      />

      <SignInRecurringModal
        open={showSignInRecurring}
        onClose={() => setShowSignInRecurring(false)}
      />
    </BentoCard>
  );
}

const GuestEmailModal = ({
  open,
  onClose,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  isPending: boolean;
}) => {
  const t = useTranslations("donate.guest-email");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubmit(email.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t("description")}</DialogDescription>

        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="mt-5" disabled={isPending}>
            {isPending ? "Loading..." : t("continue")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const SignInRecurringModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const t = useTranslations("donate.sign-in-recurring");
  const loginUrl = navigation.login() + "?r=/donate";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t("description")}</DialogDescription>

        <Button asChild className="mt-5">
          <Link href={loginUrl}>{t("button")}</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DonateForm;
