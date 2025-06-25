"use client";

import { useState } from "react";
import GoogleIcon from "@/components/icons/google";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import { signIn } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSentEmail, setIsSentEmail] = useState(false);
  const t = useTranslations();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSendingEmail(true);
    try {
      await signIn.magicLink({
        email,
        fetchOptions: {
          throw: true,
        },
        callbackURL: window.location.origin,
      });
      setIsSentEmail(true);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "google",
        fetchOptions: {
          throw: true,
        },
        callbackURL: window.location.origin,
      });
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
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
            onClick={handleGoogleLogin}
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
