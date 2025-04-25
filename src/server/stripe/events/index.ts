import type Stripe from "stripe";
import { handleCheckoutCompleted } from "./checkout-completed.event";
import { handleInvoicePaid } from "./invoice.paid.event";

const events: Record<string, (evt: Stripe.Event) => Promise<void>> = {
  "checkout.session.completed": handleCheckoutCompleted,
  "invoice.paid": handleInvoicePaid,
};

export default async function handleStripeEvent(event: Stripe.Event) {
  const handler = events[event.type];
  if (!handler) return false;
  return handler(event);
}
