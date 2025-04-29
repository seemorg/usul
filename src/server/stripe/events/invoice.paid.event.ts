import type Stripe from "stripe";
import { storeDonation } from "@/lib/upstash";

export const handleInvoicePaid = async (event: Stripe.Event) => {
  const invoice = event.data.object as Stripe.Invoice;

  const amount = invoice.amount_paid; // in cents
  const email = invoice.customer_email; // or retrieve from invoice.customer
  let interval: "monthly" | "yearly" | null = null;

  // If it’s a subscription invoice, check the subscription’s plan
  if (invoice.lines.data.length > 0) {
    const line = invoice.lines.data[0];
    const recurring = line?.price?.recurring;

    if (recurring?.interval === "month") interval = "monthly";
    else if (recurring?.interval === "year") interval = "yearly";
  }

  // Store in Redis
  await storeDonation({ invoiceId: invoice.id }, amount, email, interval);
};
