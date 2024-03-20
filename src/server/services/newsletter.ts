"use server";

import { env } from "@/env";
import { resend } from "@/lib/resend";
import { z } from "zod";

export const addEmailToNewsletter = async (email: string) => {
  const result = z.string().email().safeParse(email);

  if (!result.success) {
    throw new Error("Invalid email");
  }

  await resend.contacts.create({
    email: result.data,
    audienceId: env.RESEND_AUDIENCE_ID,
  });
};
