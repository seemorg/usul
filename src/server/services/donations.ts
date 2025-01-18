"use server";

import type Stripe from "stripe";
import stripe from "../stripe";
import { unstable_cache } from "next/cache";
import { getCurrentMonth } from "@/lib/date";
import {
  makeCurrentMonthDonorsKey,
  makeCurrentMonthTotalKey,
  redis,
} from "@/lib/upstash";
import { env } from "@/env";
import { z } from "zod";
import { nanoid } from "nanoid";
import { resend } from "@/lib/resend";

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

export const generateAndSendDonationCode = async (email: string) => {
  const response = await fetch(
    `https://verifyright.co/verify/${email}?token=${env.VERIFY_RIGHT_API_KEY}`,
  );
  const data = (await response.json()) as {
    status: boolean;
  };

  if (!data.status) {
    throw new Error("Failed to verify email");
  }

  const code = nanoid(12);

  await resend.emails.send({
    from: "usul-donations@digitalseem.org",
    to: email,
    subject: "Usul - Verify your email",
    html: `
    <p>Your verification code is <strong>${code}</strong></p>
    <br>
    <p>This code is valid for 10 minutes.</p>
    <br><br>
    
    <p>If you didn't request this, you can safely ignore this email.</p>`,
  });

  await redis.set(`code:${email}`, code, { ex: 60 * 10 }); // 10 minutes

  return code;
};

const schema = z.object({
  email: z.string().email().toLowerCase().trim(),
  code: z.string(),
  amountInUsd: z.number().min(1),
  frequency: z.enum(["monthly", "yearly", "one-time"]),
});

export const createCheckoutSession = async (
  email: string,
  code: string,
  amountInUsd: number,
  frequency: "monthly" | "yearly" | "one-time",
) => {
  const data = schema.safeParse({ email, code, amountInUsd, frequency });
  if (!data.success) {
    throw new Error("Invalid input");
  }

  const validatedData = data.data;

  // check code
  const codeInRedis = await redis.get<string>(`code:${validatedData.email}`);
  if (!codeInRedis || codeInRedis !== validatedData.code) {
    throw new Error("Invalid code");
  }

  // delete code
  await redis.del(`code:${validatedData.email}`);

  let customerId: string;
  const customerInRedis = await redis.get<string>(
    `customer:${validatedData.email}`,
  );
  if (customerInRedis) {
    customerId = customerInRedis;
  } else {
    const customer = await stripe.customers.create({
      email: validatedData.email,
    });
    customerId = customer.id;
    await redis.set(`customer:${validatedData.email}`, customerId);
  }

  // Convert amount (in USD) to cents
  const amountInCents = validatedData.amountInUsd * 100;

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  let session: Stripe.Checkout.Session;

  try {
    if (validatedData.frequency === "one-time") {
      // One-time payment
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
        (d) => d.amount === validatedData.amountInUsd,
      );

      if (presetDonation) {
        priceId =
          frequency === "monthly"
            ? presetDonation.monthlyPriceId[productEnv]
            : presetDonation.yearlyPriceId[productEnv];
      } else {
        // Recurring donation (monthly or yearly)
        // You may want to create a Price in Stripe based on `amount` and `frequency`.
        // For example, create a price on the fly:
        const price = await stripe.prices.create({
          currency: "usd",
          unit_amount: amountInCents,
          recurring: {
            interval: validatedData.frequency === "monthly" ? "month" : "year",
          },
          product_data: {
            name: "Recurring Donation",
          },
        });
        priceId = price.id;
      }

      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/donate?status=success`,
        cancel_url: `${baseUrl}/donate`,
        customer: customerId,
      });
    }
  } catch (error) {
    console.error("Error creating checkout session", error);
    throw error;
  }

  if (!session.url) {
    throw new Error("No checkout URL found");
  }

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
