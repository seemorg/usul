"use server";

import { env } from "@/env";
import { verifyEmail } from "@/lib/email-verifier";
import { resend } from "@/lib/resend";
import { z } from "zod";

export const sendSupportUsRequest = async (name: string, email: string, supportType: string) => {
    const data = z.object({
        name: z.string().min(1),
        email: z.string().email(),
        supportType: z.string().min(1),
    }).safeParse({ name, email, supportType });

    if (!data.success) {
        throw new Error("Invalid input");
    }

    const isValidEmail = await verifyEmail(data.data.email);
    if (!isValidEmail) {
        throw new Error("Invalid email");
    }

    await resend.contacts.create({
        email: data.data.email,
        audienceId: env.RESEND_AUDIENCE_ID,
        firstName: data.data.name,
    });
};
