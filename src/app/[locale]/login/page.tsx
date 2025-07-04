import type { Locale } from "next-intl";
import { Logo } from "@/components/Icons";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";

import { LoginForm } from "./login-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("login");

  return getMetadata({
    locale,
    pagePath: navigation.login(),
    title: t("login"),
    description: t("description"),
  });
}

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/">
            <Logo className="h-6" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      <div className="bg-primary relative hidden lg:block" />
    </div>
  );
}
