"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/env";
import { getMonthlyStats } from "@/server/services/donations";
import { useQuery } from "@tanstack/react-query";
import { HandCoinsIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

const GOAL = 10_000;

export function DonationStatsCard() {
  const t = useTranslations("donate");
  const formatter = useFormatter();
  const isSuccess = useSearchParams().get("status") === "success";

  const {
    data: monthlyStats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["monthly-stats"],
    queryFn: () => getMonthlyStats(),
  });

  useEffect(() => {
    if (isSuccess) {
      let count = 0;
      // refetch 3 times after 3 seconds
      const interval = setInterval(() => {
        refetch();
        count++;
        if (count === 3) {
          clearInterval(interval);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isSuccess]);

  const getMarkup = (
    key: Parameters<typeof t.rich>[0],
    options?: Parameters<typeof t.rich>[1],
  ) =>
    t.rich(key, {
      strong: (chunks) => <strong>{chunks}</strong>,
      ...(options ?? {}),
    });

  const currentMonthDonations = monthlyStats?.total ?? 0;
  const currentMonthDonors = monthlyStats?.donors ?? 0;
  const formattedDonations = monthlyStats
    ? formatter.number(currentMonthDonations, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        style: "currency",
        currency: "USD",
        currencyDisplay: "narrowSymbol",
      })
    : 0;

  return (
    <div className="bg-card text-foreground flex w-full translate-y-[20%] flex-col justify-between rounded-2xl p-10 shadow-xl shadow-black/5 sm:p-14 lg:translate-y-0">
      <div>
        {isLoading ? (
          <Skeleton className="h-[48px] w-full sm:h-[72px]" />
        ) : (
          <p className="text-primary xs:text-6xl text-5xl font-bold sm:text-7xl">
            {formattedDonations}
          </p>
        )}

        <div className="mt-7 flex gap-5">
          <p className="font-bold">
            {t("hero.donate-widget.goal", { goal: GOAL })}
          </p>
        </div>

        <div className="mt-5">
          <Progress
            value={Math.min((currentMonthDonations / GOAL) * 100, 100)}
            className="h-1"
          />
        </div>
      </div>

      <div className="h-12 sm:h-24" />

      <div>
        {isLoading ? (
          <Skeleton className="h-7 w-full" />
        ) : (
          <p className="text-lg">
            {getMarkup("hero.donate-widget.active-monthly-donors", {
              donors: currentMonthDonors,
            })}
          </p>
        )}

        <Button
          className="mt-5 h-12 w-full gap-2 bg-teal-700 text-base font-bold text-white hover:bg-teal-600"
          size="lg"
          asChild
        >
          <a href="#donate-form">
            {t("hero.donate-widget.become-a-donor")}

            <HandCoinsIcon className="size-5" />
          </a>
        </Button>

        <p className="text-muted-foreground mt-5 text-sm">
          {t("already-donor.title")}{" "}
          <a
            href={env.NEXT_PUBLIC_STRIPE_PORTAL_URL}
            target="_blank"
            className="link"
          >
            {t("already-donor.manage")}
          </a>
        </p>
      </div>
    </div>
  );
}
