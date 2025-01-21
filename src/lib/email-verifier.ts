import { env } from "@/env";

export const verifyEmail = async (email: string) => {
  const response = await fetch(
    `https://verifyright.co/verify/${encodeURIComponent(email)}?token=${env.VERIFY_RIGHT_API_KEY}`,
  );

  const data = (await response.json()) as {
    status: boolean;
  };

  return data.status;
};
