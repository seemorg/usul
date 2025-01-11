import Container from "@/components/ui/container";
import Navbar from "../../_components/navbar";

import Footer from "../../_components/footer";
import { navigation } from "@/lib/urls";
import {
  getFormatter,
  getTranslations,
  unstable_setRequestLocale,
} from "next-intl/server";
import { getMetadata } from "@/lib/seo";
import { type AppLocale, locales } from "~/i18n.config";
import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoonStarIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const generateMetadata = ({
  params: { locale },
}: {
  params: { locale: AppLocale };
}) => getMetadata({ pagePath: navigation.donate(), locale });

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
      <div className="relative flex min-h-[550px] w-full pb-10 pt-24 text-white sm:pt-32 lg:max-h-[600px]">
        <div className="absolute inset-0 z-0 h-full w-full bg-primary [clip-path:ellipse(130%_100%_at_50%_0%)]" />

        <Container className="z-[1] flex flex-col lg:flex-row lg:gap-12">
          <div className="flex-1">
            <h1 className="text-4xl font-bold sm:text-5xl">
              {t("hero.title")}
            </h1>

            <p className="mt-6 text-xl">{t("hero.subtitle")}</p>

            <p className="mt-8">{t("hero.description")}</p>
          </div>

          <div className="flex-1 sm:px-10 lg:px-0">
            <div className="flex h-[500px] translate-y-[15%] flex-col justify-between rounded-2xl bg-white p-16 text-foreground shadow-lg shadow-black/5 lg:translate-y-[5%]">
              <div>
                <p className="text-7xl font-bold text-primary">
                  ${formatter.number(52_182.54)}
                </p>

                <div className="mt-7 flex gap-5">
                  <p>{t("hero.donate-widget.month-raised")}</p>
                  <p className="font-bold">
                    {t("hero.donate-widget.goal", { goal: 75_000 })}
                  </p>
                </div>

                <div className="mt-5">
                  <Progress value={50} className="h-1" />
                </div>
              </div>

              <div>
                <p className="text-lg">
                  {getMarkup("hero.donate-widget.active-monthly-donors", {
                    donors: 3600,
                  })}
                </p>

                <Button
                  className="mt-5 h-12 w-full text-base font-bold"
                  size="lg"
                >
                  {t("hero.donate-widget.become-a-donor")}
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

              <div className="h-[250px] lg:hidden" />

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
                features={[
                  t("be-part.why-support.features.0"),
                  t("be-part.why-support.features.1"),
                  t("be-part.why-support.features.2"),
                ]}
              />
            </BentoCard>

            <BentoCard className="flex-1 p-8">
              <h3 className="text-3xl font-semibold">
                {t("be-part.choose-amount.title")}
              </h3>

              <Tabs value="one-time">
                <TabsList className="mt-5">
                  <TabsTrigger value="one-time">
                    {t("be-part.choose-amount.interval.one-time")}
                  </TabsTrigger>
                  <TabsTrigger value="monthly">
                    {t("be-part.choose-amount.interval.monthly")}
                  </TabsTrigger>
                  <TabsTrigger value="yearly">
                    {t("be-part.choose-amount.interval.yearly")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="shadow-none">
                    $25
                  </Button>
                  <Button variant="outline" className="shadow-none">
                    $50
                  </Button>
                  <Button variant="default" className="shadow-none">
                    $100
                  </Button>
                  <Button variant="outline" className="shadow-none">
                    $500
                  </Button>
                </div>

                <div className="flex items-center rounded-md border border-border">
                  <label
                    className="border-r border-border px-3 text-center text-sm"
                    htmlFor="other-amount"
                  >
                    USD
                  </label>
                  <Input
                    id="other-amount"
                    placeholder="Other Amount"
                    type="number"
                    className="min-w-[130px] border-none shadow-none ltr:pl-2 rtl:pr-2"
                  />
                </div>
              </div>

              <p className="mt-5 text-xs">{t("be-part.choose-amount.note")}</p>

              <Button
                className="mt-8 h-12 w-full text-base font-bold"
                size="lg"
              >
                {t("be-part.choose-amount.continue")}
              </Button>
            </BentoCard>
          </div>
        </div>
      </Container>
    </>
  );
}

const BentoCard = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("rounded-2xl bg-white p-12 shadow-md", className)}
    {...props}
  />
);

const FeaturesList = ({
  className,
  features,
}: {
  features: React.ReactNode[];
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-4", className)}>
    {features.map((feature, idx) => (
      <div className="flex items-start gap-4" key={idx}>
        <CheckCircleIcon className="mt-1 size-6 flex-shrink-0 text-teal-700" />
        <p className="text-lg">{feature}</p>
      </div>
    ))}
  </div>
);
