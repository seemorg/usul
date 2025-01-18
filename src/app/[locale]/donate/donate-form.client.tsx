"use client";

import BentoCard from "./bento-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormatter, useTranslations } from "next-intl";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "@/server/services/donations";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type Frequency = "one-time" | "monthly" | "yearly";
const presetAmounts = [25, 50, 100, 500];

function DonateForm() {
  const t = useTranslations("donate");
  const formatter = useFormatter();
  const [frequency, setFrequency] = useState<Frequency>("one-time");
  const [amount, setAmount] = useState<number>(100);

  const { mutateAsync: createCheckoutUrl, isPending } = useMutation({
    mutationFn: (data: { amount: number; frequency: Frequency }) => {
      return createCheckoutSession(data.amount, data.frequency);
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "An error occurred while creating the checkout URL",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: number) =>
    formatter.number(amount, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const handleSubmit = async () => {
    const url = await createCheckoutUrl({ amount, frequency });
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <BentoCard className="flex-1 p-8" id="donate-form">
      <h3 className="text-3xl font-semibold">
        {t("be-part.choose-amount.title")}
      </h3>

      <Tabs
        value={frequency}
        onValueChange={(value) => setFrequency(value as Frequency)}
      >
        <TabsList className="mt-5">
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

      <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          {presetAmounts.map((presetAmount) => (
            <Button
              key={presetAmount}
              variant={amount === presetAmount ? "default" : "outline"}
              className={cn(
                "shadow-none",
                amount === presetAmount && "border border-transparent",
              )}
              onClick={() => setAmount(presetAmount)}
            >
              {formatCurrency(presetAmount)}
            </Button>
          ))}
        </div>

        <div className="flex items-center rounded-md border border-border">
          <label
            className="border-r border-border px-3 text-center text-sm"
            htmlFor="other-amount"
          >
            USD
          </label>
          <Input
            id="other-amount"
            placeholder="Other Amount"
            type="number"
            className="min-w-[130px] border-none shadow-none ltr:pl-2 rtl:pr-2"
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
        onClick={handleSubmit}
        disabled={isPending}
      >
        {t("be-part.choose-amount.continue")}
      </Button>
    </BentoCard>
  );
}

export default DonateForm;
