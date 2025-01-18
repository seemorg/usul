import type Stripe from "stripe";
// import { resend } from "@/lib/resend";
import { env } from "@/env";
import { storeDonation } from "@/lib/upstash";

export const handleCheckoutCompleted = async (event: Stripe.Event) => {
  const session = event.data.object as Stripe.Checkout.Session;

  const email = session.customer_details?.email ?? session.customer_email;

  // Only store one-time donations in this webhook event. Recurring donations are handled in the invoice.paid webhook event.
  if (session.mode === "payment" && session.payment_status === "paid") {
    const amount = session.amount_total; // in cents
    await storeDonation({ sessionId: session.id }, amount, email, "one-time");
  }

  // Add donor to Resend Audience
  if (email) {
    if (env.NODE_ENV !== "production") {
      console.log(`[DEV] Received donation from: ${email}`);
    } else {
      // TODO: Uncomment this once we have a donors audience
      // await resend.contacts.create({
      //   email: email,
      //   audienceId: env.RESEND_DONORS_AUDIENCE_ID,
      // });
    }
  }

  // TODO: Send email to donor
};
