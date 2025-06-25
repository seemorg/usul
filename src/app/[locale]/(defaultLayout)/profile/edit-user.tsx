"use client";

import type { useSession } from "@/lib/auth";
import RequireAuth from "@/components/require-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { updateUser } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function EditUser() {
  return (
    <RequireAuth
      skeleton={
        <div className="flex max-w-xl flex-col gap-10">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-30" />
            <Skeleton className="h-9 w-full" />
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-30" />
            <Skeleton className="h-9 w-full" />
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-30" />
            <Skeleton className="h-9 w-full" />
          </div>

          <Skeleton className="h-9 w-20" />
        </div>
      }
    >
      {(data) => <EditUserForm session={data} />}
    </RequireAuth>
  );
}

type Data = NonNullable<ReturnType<typeof useSession>["data"]>;

const schema = z.object({
  name: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

const EditUserForm = ({ session }: { session: Data }) => {
  const t = useTranslations();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: session.user.name,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      updateUser({
        ...data,
        fetchOptions: {
          throw: true,
        },
      }),
    onSuccess: () => {
      toast.success(t("profile.success-message"));
    },
    onError: () => {
      toast.error(t("common.error"));
    },
  });

  const handleSubmit = (data: FormData) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex max-w-xl flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>{t("profile.name.label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("profile.name.placeholder")} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t("common.email-address")}</Label>
          <Input id="email" type="email" value={session.user.email} disabled />
        </div>

        <div>
          <Button type="submit" isLoading={isPending}>
            {t("profile.save-changes")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
