import { error } from "next/dist/build/output/log";
import type { Stripe } from "stripe";
import stripe from "@/server/stripe";
import { env } from "@/env";
import handleStripeEvent from "@/server/stripe/events";
import { NextRequest } from "next/server";

/**
 * Syncs Stripe's payment state to our database via their webhooks
 */
export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature") as string;
  if (!sig) return;

  const body = await request.text();

  let event: Stripe.Event;

  // Verify that this is a genuine Stripe request and not just somebody pinging us
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: any) {
    error(err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    const result = await handleStripeEvent(event);
    if (result === false) {
      return new Response("Event not handled", {
        status: 500,
      });
    }
  } catch (error) {
    console.log(error);
    return new Response("Webhook handler failed", {
      status: 500,
    });
  }

  return Response.json({ received: true }, { status: 200 });
}
