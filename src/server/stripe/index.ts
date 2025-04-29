import { env } from "@/env";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_API_KEY, {
  // @ts-expect-error - The Stripe docs state that null denotes the Stripe account's default version
  apiVersion: null,
  appInfo: {
    name: "Usul",
  },
});

export default stripe;
