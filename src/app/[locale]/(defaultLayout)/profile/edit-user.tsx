"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { updateUser, useSession } from "@/lib/auth";
import { navigation } from "@/lib/urls";
import { redirect, useRouter } from "@/navigation";
import { XIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditUser() {
  const { data, isPending } = useSession();
  const locale = useLocale();

  if (isPending) {
    return (
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
    );
  }

  if (!data) {
    redirect({ href: navigation.login(), locale });
    return null;
  }

  return <EditUserForm session={data} />;
}

type Data = NonNullable<ReturnType<typeof useSession>["data"]>;

const EditUserForm = ({ session }: { session: Data }) => {
  const t = useTranslations();
  const [name, setName] = useState<string>(session.user.name);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    session.user.image || null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    await updateUser({
      image: image ? await convertImageToBase64(image) : undefined,
      name: name ? name : undefined,
      fetchOptions: {
        onSuccess: () => {
          toast.success("User updated successfully");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    });

    router.refresh();
    setIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-10">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{t("profile.full-name")}</Label>
          <Input
            id="name"
            type="name"
            placeholder="John Doe"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t("common.email-address")}</Label>
          <Input id="email" type="email" value={session.user.email} disabled />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="image">{t("profile.profile-image")}</Label>
          <div className="flex items-end gap-4">
            {imagePreview && (
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="flex w-full items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                value={image ? image.name : ""}
                className="text-muted-foreground w-full"
              />

              {imagePreview && (
                <XIcon
                  className="cursor-pointer"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <Button type="submit" isLoading={isLoading}>
            {t("profile.save-changes")}
          </Button>
        </div>
      </form>
    </div>
  );
};
