"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import GoogleIcon from "@/components/icons/google";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import { signIn } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useIsClient } from "usehooks-ts";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [isSentEmail, setIsSentEmail] = useState(false);
  const searchParams = useSearchParams();
  const _redirect = searchParams.get("r");
  const isClient = useIsClient();
  const redirect = _redirect && _redirect.startsWith("/") ? _redirect : "/";
  const callbackURL = isClient
    ? `${window.location.origin}${redirect}`
    : undefined;

  const { mutate: sendMagicLink, isPending: isSendingEmail } = useMutation({
    mutationFn: async (_email: string) => {
      await signIn.magicLink({
        email: _email,
        fetchOptions: {
          throw: true,
        },
        callbackURL,
      });
    },
    onSuccess: () => {
      setIsSentEmail(true);
    },
    onError: () => {
      toast.error(t("common.error"));
    },
  });

  const { mutate: googleLogin, isPending: isLoading } = useMutation({
    mutationFn: async () => {
      await signIn.social({
        provider: "google",
        fetchOptions: {
          throw: true,
        },
        callbackURL,
      });
    },

    onError: () => {
      toast.error(t("common.error"));
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMagicLink(email);
  };

  return (
    <div className={cn("flex flex-col gap-10", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("login.title")}</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {t("login.description")}
        </p>
      </div>

      {isSentEmail ? (
        <Alert>
          <CheckCircle2Icon className="top-3! size-4" />
          <AlertTitle className="mb-0">{t("login.check-email")}</AlertTitle>
        </Alert>
      ) : (
        <div className="grid gap-6">
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-3">
              <Label htmlFor="email">{t("common.email-address")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isSendingEmail}
            >
              {isSendingEmail ? (
                <Spinner className="size-4 text-current" />
              ) : null}
              {t("login.login")}
            </Button>
          </form>

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              {t("login.or-continue-with")}
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => googleLogin()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner className="size-4" />
            ) : (
              <GoogleIcon className="size-4" />
            )}
            {t("login.login-with-x", { provider: "Google" })}
          </Button>
        </div>
      )}
    </div>
  );
}
