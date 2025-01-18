import Container from "@/components/ui/container";
import { navigation } from "@/lib/urls";
import {
  getFormatter,
  getTranslations,
  unstable_setRequestLocale,
} from "next-intl/server";
import { getMetadata } from "@/lib/seo";
import { type AppLocale, locales } from "~/i18n.config";
import { cn } from "@/lib/utils";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoonStarIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getMonthlyDonations, getMonthlyDonors } from "@/lib/upstash";
import DonateForm from "./donate-form.client";
import BentoCard from "./bento-card";
import FeaturesList from "./features-list";
import dynamicImport from "next/dynamic";

const SuccessModal = dynamicImport(() => import("./success-modal.client"), {
  ssr: false,
});

const GOAL = 75_000;

export const generateMetadata = async ({
  params: { locale },
}: {
  params: { locale: AppLocale };
}) => {
  const t = await getTranslations({ locale, namespace: "meta" });

  return getMetadata({
    pagePath: navigation.donate(),
    locale,
    title: t("donate-page.title"),
    description: t("donate-page.description"),
  });
};

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: AppLocale };
}) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "donate" });
  const formatter = await getFormatter({ locale });

  const currentMonthDonations = await getMonthlyDonations();
  const currentMonthDonors = await getMonthlyDonors();

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

  const formattedDonations = formatter.number(currentMonthDonations, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  });

  return (
    <>
      <SuccessModal />

      <div className="relative flex min-h-[550px] w-full pb-10 pt-24 text-white sm:pt-32 lg:max-h-[550px]">
        <div className="absolute inset-0 z-0 h-full w-full bg-primary" />

        <Container className="z-[1] flex flex-col lg:flex-row lg:gap-12">
          <div className="flex-1">
            <h1 className="text-4xl font-bold sm:text-5xl">
              {t("hero.title")}
            </h1>

            <p className="mt-6 text-xl">{t("hero.subtitle")}</p>

            <p className="mt-8">{t("hero.description")}</p>
          </div>

          <div className="flex-1 sm:px-10 lg:px-0">
            <div className="flex w-full translate-y-[20%] flex-col justify-between rounded-2xl bg-card p-10 text-foreground shadow-xl shadow-black/5 sm:p-14 lg:translate-y-[5%]">
              <div>
                <p className="text-5xl font-bold text-primary sm:text-7xl">
                  {formattedDonations}
                </p>

                <div className="mt-7 flex gap-5">
                  <p className="font-bold">
                    {t("hero.donate-widget.goal", { goal: GOAL })}
                  </p>
                </div>

                <div className="mt-5">
                  <Progress
                    value={Math.min((currentMonthDonations / GOAL) * 100, 100)}
                    className="h-1"
                  />
                </div>
              </div>

              <div className="h-24" />

              <div>
                <p className="text-lg">
                  {getMarkup("hero.donate-widget.active-monthly-donors", {
                    donors: currentMonthDonors,
                  })}
                </p>

                <Button
                  className="mt-5 h-12 w-full bg-teal-700 text-base font-bold text-white hover:bg-teal-600"
                  size="lg"
                  asChild
                >
                  <a href="#donate-form">
                    {t("hero.donate-widget.become-a-donor")}
                  </a>
                </Button>
              </div>
            </div>
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
                <MoonStarIcon className="size-20 text-primary" />

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
