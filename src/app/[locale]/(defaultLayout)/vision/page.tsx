import type { Locale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SelectableList } from "@/components/selectable-list";
import SupportUsForm from "@/components/support-us-form";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import {
  CheckCircleIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { PlayIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import aboutImage from "~/public/static/images/about-image.jpg";
import { DemoButton } from "../../demo-button";
import { Markdown } from "@/components/markdown";

const getStoryRoadmap = (
  t: Awaited<ReturnType<typeof getTranslations<"about">>>,
) => [
    {
      year: "2019",
      tag: t("story.roadmap.2019.tag"),
      title: t("story.roadmap.2019.title"),
      description: t("story.roadmap.2019.description"),
    },
    {
      year: "2020-2022",
      tag: t("story.roadmap.2020-2022.tag"),
      title: t("story.roadmap.2020-2022.title"),
      description: t("story.roadmap.2020-2022.description"),
    },
    {
      year: "2023",
      tag: t("story.roadmap.2023.tag"),
      title: t("story.roadmap.2023.title"),
      description: t("story.roadmap.2023.description"),
    },
    {
      year: "2024",
      tag: t("story.roadmap.2024.tag"),
      title: t("story.roadmap.2024.title"),
      description: t("story.roadmap.2024.description"),
    },
    {
      year: "2025",
      tag: t("story.roadmap.2025.tag"),
      title: t("story.roadmap.2025.title"),
      description: t("story.roadmap.2025.description"),
    },
  ];

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations("meta");

  return getMetadata({
    locale,
    pagePath: navigation.vision(),
    title: t("about-page.title"),
    description: t("about-page.description"),
  });
};

export default async function VisionPage() {
  const t = await getTranslations("about");
  try {
    return (
      <div>
        {/* Hero */}
        <div className="bg-muted-primary absolute inset-0 z-0 h-[100px] w-full"></div>
        <div className="relative flex min-h-[1200px] w-full pt-24 pb-10 text-white sm:pt-28">
          <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
            <Image
              src={aboutImage.src}
              alt={t("hero.imageAlt")}
              width={1442}
              height={1931}
              className="absolute left-0 h-full object-cover md:w-full lg:h-auto xl:-bottom-[70vh]"
            />
            <div className="from-muted-primary absolute inset-0 h-full w-full bg-gradient-to-b from-20% to-transparent to-90%"></div>
          </div>

          <Container className="z-1 flex flex-col items-start gap-8">
            <h1 className="text-left text-4xl font-bold sm:text-5xl">
              {t("hero.title")}
            </h1>

            <div className="mt-5 flex w-full flex-col gap-16 text-left text-xl text-white/80 lg:flex-row">
              <p className="flex-1 whitespace-pre-line">
                <Markdown>{t("hero.paragraph1")}</Markdown>
              </p>
              <p className="flex-1 whitespace-pre-line">
                <Markdown>{t("hero.paragraph2")}</Markdown>
              </p>
            </div>

            <div className="mt-7 flex w-full justify-start gap-2">
              <Link href={navigation.chat.all()}>
                <Button variant="secondary" className="h-full">
                  {t("hero.tryUsul")}
                </Button>
              </Link>
              <DemoButton>
                <PlayIcon className="size-4" />
                {t("hero.seeHowItWorks")}
              </DemoButton>
            </div>
          </Container>
        </div>

        <Container className="mt-10 space-y-56 pt-8 lg:pt-12 2xl:max-w-6xl">
          {/* Problem statement */}
          <div className="flex flex-col items-start justify-between gap-16 md:flex-row">
            <div className="flex max-w-[430px] flex-col">
              <h3 className="text-primary mb-4 text-2xl font-bold">
                {t("problem.tag")}
              </h3>
              <h2 className="mb-6 text-3xl font-bold">{t("problem.title")}</h2>
              <p>
                {t("problem.description")} <b>{t("problem.challenge")}</b>
              </p>
            </div>
            <div className="bg-muted flex max-w-[380px] flex-col rounded-3xl p-8">
              <p className="mb-12">{t("problem.meanwhile")}</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <p>{t("problem.notOnline")}</p>
                </li>
                <li>
                  <p>{t("problem.scannedPdfs")}</p>
                </li>
                <li>
                  <p>{t("problem.mixedContent")}</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Story */}
          <div className="flex flex-col items-start justify-between gap-16">
            <div className="flex flex-col">
              <h3 className="text-primary mb-4 text-2xl font-bold">
                {t("story.tag")}
              </h3>
              <h2 className="mb-6 max-w-[430px] text-3xl font-bold">
                {t("story.title")}
              </h2>
              <p>{t("story.description")}</p>
            </div>
            <div className="relative w-full">
              {/* Left fade overlay */}
              <div className="from-background pointer-events-none absolute top-0 left-0 z-10 h-full w-1 bg-gradient-to-r to-transparent" />
              {/* Right fade overlay */}
              <div className="from-background pointer-events-none absolute top-0 right-0 z-10 h-full w-1 bg-gradient-to-l to-transparent" />
              <div className="flex w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {getStoryRoadmap(t).map((item) => (
                  <div key={item.year} className="flex min-w-[430px] gap-4">
                    <p className="mt-1 text-xs font-medium opacity-60">
                      {item.year}
                    </p>
                    <div className="bg-muted relative h-full w-2">
                      <div className="bg-collection-green absolute top-2 h-2 w-2 rounded-full ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2" />
                    </div>
                    <div className="flex flex-col gap-4">
                      <p className="bg-collection-green w-fit rounded-full px-2 py-1 text-xs font-medium text-white">
                        {item.tag}
                      </p>
                      <h5 className="text-2xl font-medium">{item.title}</h5>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="flex flex-col items-start justify-between gap-16">
            <div className="flex flex-col">
              <h3 className="text-primary mb-4 text-2xl font-bold">
                {t("values.tag")}
              </h3>
              <h2 className="mb-6 max-w-[600px] text-3xl font-bold">
                {t("values.title")}
              </h2>
            </div>
            <div className="flex w-full flex-col gap-8 lg:flex-row">
              <div className="bg-muted flex flex-1 flex-col gap-4 rounded-3xl p-8">
                <ShieldCheckIcon className="fill-collection-green size-6" />
                <h5 className="text-xl font-bold">
                  {t("values.credibility.title")}
                </h5>
                <p className="text-muted-foreground text-sm">
                  {t("values.credibility.description")}
                </p>
              </div>
              <div className="bg-muted flex flex-1 flex-col gap-4 rounded-3xl p-8">
                <StarIcon className="fill-collection-green size-6" />
                <h5 className="text-xl font-bold">
                  {t("values.reliability.title")}
                </h5>
                <p className="text-muted-foreground text-sm">
                  {t("values.reliability.description")}
                </p>
              </div>
              <div className="bg-muted flex flex-1 flex-col gap-4 rounded-3xl p-8">
                <GlobeAltIcon className="fill-collection-green size-6" />
                <h5 className="text-xl font-bold">
                  {t("values.access.title")}
                </h5>
                <p className="text-muted-foreground text-sm">
                  {t("values.access.description")}
                </p>
              </div>
            </div>
          </div>

          {/* What makes Usul different? */}
          <div className="flex flex-col items-start justify-between gap-16 lg:flex-row">
            <div className="flex flex-1 flex-col">
              <h2 className="mb-6 text-3xl font-bold">
                {t("different.title")}
              </h2>
              <p className="max-w-[350px]">{t("different.description")}</p>
            </div>
            <ul className="flex-1 space-y-4">
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="fill-collection-green mt-1 size-5 shrink-0" />
                <p>{t("different.curatedCorpus")}</p>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="fill-collection-green mt-1 size-5 shrink-0" />
                <p>{t("different.fineTuned")}</p>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="fill-collection-green mt-1 size-5 shrink-0" />
                <p>{t("different.citations")}</p>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="fill-collection-green mt-1 size-5 shrink-0" />
                <p>{t("different.collaboration")}</p>
              </li>
            </ul>
          </div>

          {/* How We Operate */}
          <div className="flex flex-col items-start justify-between gap-16 lg:flex-row">
            <div className="flex flex-1 flex-col">
              <h2 className="mb-6 text-3xl font-bold text-nowrap">
                {t("operations.title")}
              </h2>
              <p className="mb-12">{t("operations.description")}</p>
              <p>{t("operations.supported")}</p>
              <SelectableList
                className="mt-6 max-w-[430px]"
                items={[
                  {
                    id: "donations",
                    content: t("operations.donations"),
                  },
                  {
                    id: "contracts",
                    content: t("operations.contracts"),
                  },
                  {
                    id: "contributions",
                    content: t("operations.contributions"),
                  },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <SupportUsForm />
          </div>
        </Container>
      </div>
    );
  } catch (error) {
    console.log(error);

    notFound();
  }
}
