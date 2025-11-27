"use client";

import { useState } from "react";
import Link from "next/link";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { addEmailToNewsletter } from "@/server/services/newsletter";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

const presetSupportTypes = ["expertise", "time", "financial", "other"] as const;

interface Props {
  className?: string;
}

export default function SupportUsForm({ className }: Props) {
  const t = useTranslations("common.support-us");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [supportType, setSupportType] = useState<string>("time");

  const openEmailPopup = () => {
    const subject = encodeURIComponent(
      `Support Request - ${name} - ${supportType}`,
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nSupport Type: ${supportType}\n\n`,
    );
    window.open(
      `mailto:help@usul.ai?subject=${subject}&body=${body}`,
      "_blank",
    );
  };

  const { mutateAsync, isPending, isSuccess, isError } = useMutation({
    mutationFn: addEmailToNewsletter,
    onSuccess: () => {
      toast.success(t("successMessage"));
    },
    onError: () => {
      toast.error(t("errorMessage"));
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutateAsync(email);
    openEmailPopup();
  };

  return (
    <form
      className={cn("flex max-w-[400px] flex-col items-center", className)}
      onSubmit={handleSubmit}
    >
      <h2 className="mb-4 text-3xl font-bold">{t("title")}</h2>
      <p className="mb-16 text-center">{t("description")}</p>
      <Label htmlFor="name" className="text-muted-foreground mb-2 w-full">
        {t("name")}
      </Label>
      <Input
        type="text"
        placeholder={t("namePlaceholder")}
        className="bg-muted mb-6 w-full border-none"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Label htmlFor="email" className="text-muted-foreground mb-2 w-full">
        {t("email")}
      </Label>
      <Input
        type="email"
        placeholder={t("emailPlaceholder")}
        className="bg-muted mb-6 w-full border-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Label className="text-muted-foreground mb-4 w-full">
        {t("support-type")}
      </Label>
      <div className="flex w-full items-start gap-3">
        {presetSupportTypes.map((presentSupportType) => (
          <Button
            key={presentSupportType}
            type="button"
            variant={supportType === presentSupportType ? "default" : "outline"}
            className={cn(
              "rounded-full shadow-none",
              supportType === presentSupportType && "border border-transparent",
            )}
            onClick={() => setSupportType(presentSupportType)}
          >
            {t(`supportTypes.${presentSupportType}`)}
          </Button>
        ))}
      </div>
      <Separator className="my-6 w-full" />
      <Button
        type="submit"
        className="mb-8 h-12 w-full font-bold"
        disabled={isPending}
      >
        {isPending ? t("sending") : t("send")}
      </Button>
      <Label className="text-muted-foreground text-sm font-bold">
        {t("wantToSupport")}{" "}
        <Link href={navigation.donate()} className="text-primary underline">
          {t("donateNow")}
        </Link>
      </Label>
    </form>
  );
}
