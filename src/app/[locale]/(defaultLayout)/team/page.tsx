import type { Locale } from "next-intl";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { VOLUNTEER_URL } from "@/lib/constants";
import { getMetadata, SITE_CONFIG } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { HeartHandshakeIcon, MailIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import MemberCard from "./member-card";
import { boardMembers, foundingMembers, members } from "./members";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
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
    <Container className="max-w-5xl pt-8 lg:pt-12 2xl:max-w-6xl">
      <h1 className="text-4xl font-bold lg:text-5xl">{t("title")}</h1>
      <p className="mt-8">{t("subtitle")}</p>

      <div className="mt-10 flex items-center gap-5">
        <Button className="h-9 gap-2" asChild>
          <a href={VOLUNTEER_URL} target="_blank">
            <HeartHandshakeIcon className="size-4" />
            {t("become-a-volunteer")}
          </a>
        </Button>

        <Button className="h-9 gap-2" variant="outline" asChild>
          <a href={`mailto:${SITE_CONFIG.contactEmail}`} target="_blank">
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

      <div className="mt-14">
        <h1 className="text-2xl font-bold lg:text-3xl">
          {t("founders-title")}
        </h1>
        <p className="mt-4">{t("founders-subtitle")}</p>

        <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {foundingMembers.map((member) => (
            <MemberCard
              key={member.key}
              name={t(`founders.${member.key}.name` as any)}
              role={t(`roles.${member.roleKey}` as any)}
              description={t(`founders.${member.key}.description` as any)}
              image={member.image}
              blurDataUrl={member.blurDataUrl}
            />
          ))}
        </div>
      </div>

      <div className="mt-44 mb-20">
        <h1 className="text-4xl font-bold lg:text-5xl">{t("board-title")}</h1>
        <p className="mt-8">{t("board-subtitle")}</p>

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
