"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { addEmailToNewsletter } from "@/server/services/newsletter";
import { useMutation } from "@tanstack/react-query";
import Spinner from "./ui/spinner";
import { AlertTitle } from "./ui/alert";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";

export default function NewsletterForm() {
  const t = useTranslations("common");
  const [email, setEmail] = useState("");

  const { mutateAsync, isPending, isSuccess, isError } = useMutation({
    mutationFn: addEmailToNewsletter,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await mutateAsync(email);
  };

  if (isSuccess) {
    return (
      <div className="relative flex w-full items-center rounded-lg border bg-background px-4 py-3 text-sm text-foreground [&>svg]:text-foreground [&>svg~*]:ltr:pl-4 [&>svg~*]:rtl:pr-4">
        <CheckCircleIcon className="h-5 w-5" />
        <AlertTitle className="mb-0">{t("coming-soon.success")}</AlertTitle>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative flex w-full items-center rounded-lg border bg-background px-4 py-3 text-sm text-foreground [&>svg]:text-foreground [&>svg~*]:ltr:pl-4 [&>svg~*]:rtl:pr-4">
        <XCircleIcon className="h-5 w-5" />
        <AlertTitle>{t("coming-soon.error")}</AlertTitle>
      </div>
    );
  }

  return (
    <form className="flex gap-4 sm:max-w-md" onSubmit={handleSubmit}>
      <Button asChild>
        <Link href={navigation.donate()}>
          {t("navigation.contribute.donate.title")}
        </Link>
      </Button>

      <div className="flex w-[400px] max-w-full overflow-hidden rounded-md border border-border">
        <label htmlFor="newsletter-email-address" className="sr-only">
          {t("footer.email-address")}
        </label>

        <Input
          id="newsletter-email-address"
          placeholder={t("footer.email-address")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full flex-1 rounded-none border border-none border-border bg-background"
        />

        <div className="shrink-0">
          <Button
            variant="secondary"
            disabled={isPending}
            className="gap-2 border-l border-border ltr:rounded-l-none rtl:rounded-r-none"
          >
            {isPending && <Spinner className="h-4 w-4 text-current" />}
            {t("footer.subscribe")}
          </Button>
        </div>
      </div>
    </form>
  );
}
