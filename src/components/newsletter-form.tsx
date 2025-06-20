"use client";

import { useState } from "react";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { addEmailToNewsletter } from "@/server/services/newsletter";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Spinner from "./ui/spinner";

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
      <div className="bg-background text-foreground [&>svg]:text-foreground relative flex w-full items-center rounded-lg border px-4 py-3 text-sm [&>svg~*]:ltr:pl-4 [&>svg~*]:rtl:pr-4">
        <CheckCircleIcon className="h-5 w-5" />
        <AlertTitle className="mb-0">{t("coming-soon.success")}</AlertTitle>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-background text-foreground [&>svg]:text-foreground relative flex w-full items-center rounded-lg border px-4 py-3 text-sm [&>svg~*]:ltr:pl-4 [&>svg~*]:rtl:pr-4">
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

      <div className="border-border flex w-[400px] max-w-full overflow-hidden rounded-md border">
        <label htmlFor="newsletter-email-address" className="sr-only">
          {t("email-address")}
        </label>

        <Input
          id="newsletter-email-address"
          placeholder={t("email-address")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-border bg-background w-full flex-1 rounded-none border border-none"
        />

        <div className="shrink-0">
          <Button
            variant="secondary"
            disabled={isPending}
            className="border-border gap-2 border-l ltr:rounded-l-none rtl:rounded-r-none"
          >
            {isPending && <Spinner className="h-4 w-4 text-current" />}
            {t("footer.subscribe")}
          </Button>
        </div>
      </div>
    </form>
  );
}
