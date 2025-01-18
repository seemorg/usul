"use server";

import type Stripe from "stripe";
import stripe from "../stripe";

export const createCheckoutSession = async (
  amountInUsd: number,
  frequency: "monthly" | "yearly" | "one-time",
) => {
  if (!amountInUsd || !frequency) {
    throw new Error("Missing required fields");
  }

  if (amountInUsd < 1) {
    throw new Error("Amount must be greater than 1 USD");
  }

  if (
    frequency !== "monthly" &&
    frequency !== "yearly" &&
    frequency !== "one-time"
  ) {
    throw new Error("Invalid frequency");
  }

  // Convert amount (in USD) to cents
  const amountInCents = amountInUsd * 100;

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  let session: Stripe.Checkout.Session;

  try {
    if (frequency === "one-time") {
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
        cancel_url: `${baseUrl}/donate?status=cancel`,
      });
    } else {
      // Recurring donation (monthly or yearly)
      // You may want to create a Price in Stripe based on `amount` and `frequency`.
      // For example, create a price on the fly:
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

      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/donate?status=success`,
        cancel_url: `${baseUrl}/donate?status=cancel`,
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
