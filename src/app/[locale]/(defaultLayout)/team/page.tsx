import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { HeartHandshakeIcon, MailIcon } from "lucide-react";
import MemberCard from "./member-card";
import { boardMembers, members } from "./members";
import { config, getMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { VOLUNTEER_EMAIL } from "@/lib/constants";
import type { AppLocale } from "~/i18n.config";
import { navigation } from "@/lib/urls";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations("meta");
  return getMetadata({
    locale,
    pagePath: navigation.team(),
    title: t("team-page.title"),
    description: t("team-page.description"),
  });
};

export default async function TeamPage() {
  const t = await getTranslations("team");

  return (
    <Container className="max-w-5xl pt-16 2xl:max-w-6xl">
      <h1 className="mb-15 text-5xl font-bold">{t("title")}</h1>
      <p className="mt-5">{t("subtitle")}</p>

      <div className="flex items-center gap-5">
        <Button className="mt-10 h-9 gap-2" asChild>
          <a href={`mailto:${VOLUNTEER_EMAIL}`} target="_blank">
            <HeartHandshakeIcon className="size-4" />
            {t("become-a-volunteer")}
          </a>
        </Button>
        <Button className="mt-10 h-9 gap-2" variant="outline" asChild>
          <a href={`mailto:${config.contactEmail}`} target="_blank">
            <MailIcon className="size-4" />
            {t("contact-us")}
          </a>
        </Button>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {members.map((member) => (
          <MemberCard
            key={member.key}
            name={t(`members.${member.key}.name` as any)}
            role={t(`roles.${member.roleKey}` as any)}
            description={t(`members.${member.key}.description` as any)}
            image={member.image}
            blurDataUrl={member.blurDataUrl}
          />
        ))}
      </div>

      <div className="mb-20 mt-44">
        <h1 className="text-5xl font-bold">{t("board-title")}</h1>
        <p className="mt-5">{t("board-subtitle")}</p>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {boardMembers.map((member) => (
            <MemberCard
              key={member.key}
              name={t(`board-members.${member.key}.name` as any)}
              description={t(`board-members.${member.key}.description` as any)}
              image={member.image}
              blurDataUrl={member.blurDataUrl}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
