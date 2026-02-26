"use server";

import type Stripe from "stripe";
import { unstable_cache } from "next/cache";
import { env } from "@/env";
import { getCurrentMonth } from "@/lib/date";
import { getSession } from "@/lib/get-session";
import {
  makeCurrentMonthDonorsKey,
  makeCurrentMonthTotalKey,
  redis,
} from "@/lib/upstash";
import { z } from "zod";

import stripe from "../stripe";

const presetDonations = [
  {
    amount: 25,
    monthlyPriceId: {
      production: "price_1QiegZHQeTWInv1ysgB6Nr2M",
      test: "price_1QiexFHQeTWInv1ygbhnq8s1",
    },
    yearlyPriceId: {
      production: "price_1QieiBHQeTWInv1yDQNie2M6",
      test: "price_1QieyKHQeTWInv1yjhgCqi5W",
    },
  },
  {
    amount: 50,
    monthlyPriceId: {
      production: "price_1QiejVHQeTWInv1yItufSfDO",
      test: "price_1QieySHQeTWInv1yXM9zjRmr",
    },
    yearlyPriceId: {
      production: "price_1QiejeHQeTWInv1yF469JTxh",
      test: "price_1QieycHQeTWInv1yNoQMcgMa",
    },
  },
  {
    amount: 100,
    monthlyPriceId: {
      production: "price_1QiejtHQeTWInv1ySDzqqaeX",
      test: "price_1QieyiHQeTWInv1yikQ2kNuI",
    },
    yearlyPriceId: {
      production: "price_1Qiek3HQeTWInv1yKqMEz3Et",
      test: "price_1QieyvHQeTWInv1ywjZPbQFJ",
    },
  },
  {
    amount: 500,
    monthlyPriceId: {
      production: "price_1QiekDHQeTWInv1yleqkvfZK",
      test: "price_1Qiez6HQeTWInv1yNawlKMKh",
    },
    yearlyPriceId: {
      production: "price_1QiekMHQeTWInv1yJD71pdSk",
      test: "price_1QiezGHQeTWInv1yTfQk8icK",
    },
  },
];

const productEnv = env.VERCEL_ENV === "production" ? "production" : "test";

const baseUrl =
  env.VERCEL_ENV === "production"
    ? "https://usul.ai"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

async function getOrCreateCustomer(email: string): Promise<string> {
  const normalizedEmail = email.toLowerCase().trim();
  const customerInRedis = await redis.get<string>(
    `customer:${normalizedEmail}`,
  );
  if (customerInRedis) return customerInRedis;

  const customer = await stripe.customers.create({
    email: normalizedEmail,
  });
  await redis.set(`customer:${normalizedEmail}`, customer.id);
  return customer.id;
}

async function createStripeCheckoutSession(params: {
  email: string;
  amountInCents: number;
  frequency: "monthly" | "yearly" | "one-time";
  customerId: string;
}): Promise<string> {
  const { email, amountInCents, frequency, customerId } = params;
  let session: Stripe.Checkout.Session;

  if (frequency === "one-time") {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/donate?status=success`,
      cancel_url: `${baseUrl}/donate`,
      customer: customerId,
    });
  } else {
    let priceId: string;
    const presetDonation = presetDonations.find(
      (d) => d.amount === amountInCents / 100,
    );

    if (presetDonation) {
      priceId =
        frequency === "monthly"
          ? presetDonation.monthlyPriceId[productEnv]
          : presetDonation.yearlyPriceId[productEnv];
    } else {
      const price = await stripe.prices.create({
        currency: "usd",
        unit_amount: amountInCents,
        recurring: {
          interval: frequency === "monthly" ? "month" : "year",
        },
        product_data: {
          name: "Recurring Donation",
        },
      });
      priceId = price.id;
    }

    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/donate?status=success`,
      cancel_url: `${baseUrl}/donate`,
      customer: customerId,
    });
  }

  if (!session.url) throw new Error("No checkout URL found");
  return session.url;
}

/** For logged-in users: create checkout directly (no email verification). */
export const createCheckoutSessionForAuthenticatedUser = async (
  amountInUsd: number,
  frequency: "monthly" | "yearly" | "one-time",
  clientEmail?: string,
) => {
  let email: string | null = null;

  const session = await getSession();
  if (session?.user?.email) {
    email = session.user.email.toLowerCase().trim();
  }
  // Fallback: when server can't read session (e.g. cross-origin cookies in dev),
  // accept email from client when they report being logged in
  if (!email && clientEmail) {
    const validated = z
      .string()
      .email()
      .transform((s) => s.toLowerCase().trim())
      .safeParse(clientEmail);
    if (validated.success) email = validated.data;
  }

  if (!email) {
    throw new Error("You must be signed in to donate");
  }
  const amountInCents = amountInUsd * 100;

  if (amountInCents < 100) {
    throw new Error("Invalid amount");
  }

  const customerId = await getOrCreateCustomer(email);
  return createStripeCheckoutSession({
    email,
    amountInCents,
    frequency,
    customerId,
  });
};

const guestOneTimeSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  amountInUsd: z.number().min(1),
});

/** For guests: one-time donation only. Uses customer_email (no account needed). */
export const createCheckoutSessionForGuest = async (
  email: string,
  amountInUsd: number,
) => {
  const data = guestOneTimeSchema.safeParse({ email, amountInUsd });
  if (!data.success) {
    throw new Error("Invalid input");
  }

  const { email: validatedEmail, amountInUsd: amount } = data.data;
  const amountInCents = amount * 100;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Donation",
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/donate?status=success`,
    cancel_url: `${baseUrl}/donate`,
    customer_email: validatedEmail,
  });

  if (!session.url) throw new Error("No checkout URL found");
  return session.url;
};

export const getMonthlyStats = async () => {
  const currentMonth = getCurrentMonth();

  return unstable_cache(
    async () => {
      const monthKey = makeCurrentMonthTotalKey();
      const total = (await redis.get<number>(monthKey)) ?? 0;

      const donorsKey = makeCurrentMonthDonorsKey();
      const donors = (await redis.get<number>(donorsKey)) ?? 0;

      return {
        total,
        donors,
      };
    },
    [`monthly-stats-${currentMonth}`],
    { revalidate: 60 * 60 * 24, tags: ["monthly-stats"] },
  )();
};
