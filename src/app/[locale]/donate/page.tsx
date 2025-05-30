import type { Locale } from "next-intl";
import Image from "next/image";
import Container from "@/components/ui/container";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { MoonStarIcon } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import BentoCard from "./bento-card";
import DonateForm from "./donate-form.client";
import FeaturesList from "./features-list";
import SuccessModal from "./success-modal.client";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "meta" });

  return getMetadata({
    pagePath: navigation.donate(),
    locale,
    title: t("donate-page.title"),
    description: t("donate-page.description"),
  });
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "donate" });

  const getMarkup = (
    key: Parameters<typeof t.rich>[0],
    options?: Parameters<typeof t.rich>[1],
  ) =>
    t.rich(key, {
      strong: (chunks) => <strong>{chunks}</strong>,
      ...(options ?? {}),
    });

  const roadmap = [
    {
      title: t("roadmap.items.0.title"),
      features: [
        t("roadmap.items.0.features.0"),
        t("roadmap.items.0.features.1"),
      ],
    },
    {
      title: t("roadmap.items.1.title"),
      features: [
        t("roadmap.items.1.features.0"),
        t("roadmap.items.1.features.1"),
      ],
    },
    {
      title: t("roadmap.items.2.title"),
      features: [
        t("roadmap.items.2.features.0"),
        t("roadmap.items.2.features.1"),
      ],
    },
  ];

  return (
    <>
      <SuccessModal />

      <div className="relative flex min-h-[550px] w-full pt-24 pb-10 text-white sm:pt-32 lg:max-h-[550px]">
        <div className="bg-muted-primary absolute inset-0 z-0 h-full w-full" />

        <Container className="z-1 flex flex-col lg:flex-row lg:gap-12">
          <div className="flex-1">
            <h1 className="text-4xl font-bold sm:text-5xl">
              {t("hero.title")}
            </h1>

            <p className="mt-6 text-xl">{t("hero.subtitle")}</p>

            <p className="mt-8">{t("hero.description")}</p>
          </div>

          <div className="flex-1 text-black sm:px-10 lg:px-0">
            {/* <DonationStatsCard /> */}
            <DonateForm layout="hero" />
          </div>
        </Container>
      </div>

      <Container className="mt-40 flex flex-col gap-40 pb-12">
        <div>
          <h2 className="text-5xl font-bold">{t("achievements.title")}</h2>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <BentoCard>
              <h3 className="text-3xl font-semibold">
                {t("achievements.one.title")}
              </h3>

              <FeaturesList
                className="mt-10"
                features={[
                  getMarkup("achievements.one.features.0"),
                  getMarkup("achievements.one.features.1"),
                ]}
              />
            </BentoCard>

            <BentoCard>
              <h3 className="text-3xl font-semibold">
                {t("achievements.two.title")}
              </h3>

              <FeaturesList
                className="mt-10"
                features={[
                  getMarkup("achievements.two.features.0"),
                  getMarkup("achievements.two.features.1"),
                ]}
              />
            </BentoCard>

            <BentoCard className="relative flex min-h-[400px] flex-col overflow-hidden md:col-span-2">
              <div className="flex h-full flex-col lg:w-1/2 lg:justify-center">
                <MoonStarIcon className="text-primary size-20" />

                <h3 className="mt-8 text-3xl font-semibold">
                  {t("achievements.three.title")}
                </h3>

                <p className="mt-6 text-lg">
                  {getMarkup("achievements.three.description")}
                </p>
              </div>

              <div className="xs:h-[250px] h-[200px] md:h-[280px] lg:hidden" />

              <Image
                src="/images/features-screenshot.png"
                alt="Features screenshot"
                width={746}
                height={466}
                className={cn(
                  "absolute bottom-0 translate-y-[30%] rounded-lg shadow-2xl sm:translate-y-[40%] lg:translate-y-[20%]",
                  "ltr:right-0 rtl:left-0",
                  "ltr:translate-x-[15%] lg:ltr:translate-x-[35%] rtl:translate-x-[-15%] lg:rtl:translate-x-[-35%]",
                  "ltr:rotate-1 rtl:-rotate-1",
                )}
              />
            </BentoCard>
          </div>
        </div>

        <div>
          <h2 className="text-5xl">{getMarkup("roadmap.title")}</h2>
          <p className="mt-2">{t("roadmap.description")}</p>
          <div className="mt-8 flex flex-col gap-6">
            {roadmap.map((item, idx) => (
              <BentoCard className="p-10" key={idx}>
                <h3 className="text-3xl font-semibold">{item.title}</h3>
                <FeaturesList className="mt-8" features={item.features} />
              </BentoCard>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-5xl font-bold">{t("be-part.title")}</h2>
          <p className="mt-2">{t("be-part.description")}</p>
          <div className="mt-8 flex flex-col gap-6 lg:flex-row">
            <BentoCard className="flex-1 p-10">
              <h3 className="text-3xl font-semibold">
                {t("be-part.why-support.title")}
              </h3>

              <FeaturesList
                className="mt-8"
                style="list"
                features={[
                  t("be-part.why-support.features.0"),
                  t("be-part.why-support.features.1"),
                  t("be-part.why-support.features.2"),
                ]}
              />
            </BentoCard>

            <DonateForm />
          </div>
        </div>
      </Container>
    </>
  );
}
