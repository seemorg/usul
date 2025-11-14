import { revalidateTag } from "next/cache";
import { env } from "@/env";
import { Redis } from "@upstash/redis";

import { getCurrentMonth } from "./date";

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export type DonationRecord = {
  email: string | null;
  amount: number; // in dollars
  interval: "one-time" | "monthly" | "yearly" | null;
  timestamp: number; // in milliseconds
};

export const makeCurrentMonthTotalKey = () =>
  `donations:totals:${getCurrentMonth()}`;
export const makeCurrentMonthDonorsKey = () =>
  `donations:donors:${getCurrentMonth()}`;

export async function storeDonation(
  obj: { sessionId: string } | { invoiceId: string },
  amountInCents: number | null | undefined,
  email: string | null | undefined,
  interval: "one-time" | "monthly" | "yearly" | null,
) {
  // on staging environments, don't store anything to redis and just return
  if (env.VERCEL_ENV !== "production") {
    return true;
  }

  if (!amountInCents) return false;

  // store in dollars
  const amount = amountInCents / 100;

  const donationRecord: DonationRecord = {
    ...obj,
    email: email ?? null,
    amount,
    interval,
    timestamp: Date.now(),
  };

  // check if donations array exists
  const donations = await redis.exists("donations");
  if (!donations) {
    await redis.json.set("donations", "$", [donationRecord]);
  } else {
    await redis.json.arrappend("donations", "$", donationRecord);
  }

  // Increment the current month's total
  const monthKey = makeCurrentMonthTotalKey();
  await redis.incrbyfloat(monthKey, amount);

  // Increment the current month's donors count
  const donorsKey = makeCurrentMonthDonorsKey();
  await redis.incr(donorsKey);

  invalidateMonthlyStats();

  return true;
}

// export async function getDonations(): Promise<DonationRecord[]> {
//   const data = await redis.json.get<DonationRecord[]>("donations", "items");
//   return data ?? [];
// }

export const invalidateMonthlyStats = () => {
  revalidateTag("monthly-stats", {});
};
