import type { NamespaceTranslations } from "@/types/NamespaceTranslations";
import type { JSX } from "react";
import ComingSoonModal from "@/components/coming-soon-modal";
import GithubIcon from "@/components/icons/github";
import InstagramIcon from "@/components/icons/instagram";
import XformerlyTwitter from "@/components/icons/x";
import NewsletterForm from "@/components/newsletter-form";
import Container from "@/components/ui/container";
import {
  ADD_TEXT_URL,
  FEEDBACK_URL,
  REPORT_MISTAKE_URL,
  VOLUNTEER_URL,
} from "@/lib/constants";
import { getLocaleDirection } from "@/lib/locale/utils";
import { SITE_CONFIG } from "@/lib/seo";
import { navigation as urls } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";

import FooterDemoButton from "./demo-button";

type NavItem = {
  label: NamespaceTranslations<"common">;
  href?: string;
  isDemo?: boolean;
};

const navigation = {
  about: [
    {
      label: "navigation.about.about.title",
      href: urls.about(),
    },
    {
      label: "navigation.about.team.title",
      href: urls.team(),
    },
    {
      label: "navigation.about.demo.title",
      isDemo: true,
    },
    {
      label: "navigation.about.contact.title",
      href: `mailto:${SITE_CONFIG.contactEmail}`,
    },
  ] satisfies NavItem[],
  browse: [
    { label: "navigation.browse.texts.title", href: urls.books.all() },
    { label: "navigation.browse.authors.title", href: urls.authors.all() },
    { label: "navigation.browse.genres.title", href: urls.genres.all() },
    { label: "navigation.browse.regions.title", href: urls.regions.all() },
  ] satisfies NavItem[],
  contribute: [
    {
      label: "navigation.contribute.add-text.title",
      href: ADD_TEXT_URL,
    },
    {
      label: "navigation.contribute.report-mistake.title",
      href: REPORT_MISTAKE_URL,
    },
    {
      label: "navigation.contribute.feedback.title",
      href: FEEDBACK_URL,
    },
    {
      label: "navigation.contribute.volunteer.title",
      href: VOLUNTEER_URL,
    },
  ] satisfies NavItem[],
  social: [
    {
      name: "GitHub",
      href: "https://github.com/seemorg",
      icon: GithubIcon,
    },
    {
      name: "X (formerly Twitter)",
      href: "https://x.com/Usul_AI",
      icon: XformerlyTwitter,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/usul_ai/",
      icon: InstagramIcon,
    },
  ] as {
    name: string;
    href: string;
    icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  }[],
};

const FooterRow = ({ title, items }: { title: string; items: NavItem[] }) => {
  const t = useTranslations("common");

  return (
    <div className="w-fit xl:mx-auto">
      <h3 className="text-foreground text-sm leading-6 font-bold">{title}</h3>

      <ul role="list" className="mt-6 space-y-4">
        {items.map((item) => {
          const linkClassName =
            "text-sm leading-6 text-muted-foreground hover:text-secondary-foreground";

          let link;
          if (item.href) {
            link = (
              <Link
                href={item.href}
                className={linkClassName}
                target={item.href.startsWith("mailto:") ? "_blank" : undefined}
              >
                {t(item.label)}
              </Link>
            );
          } else if (item.isDemo) {
            link = (
              <FooterDemoButton className={cn(linkClassName, "cursor-pointer")}>
                {t(item.label)}
              </FooterDemoButton>
            );
          } else {
            link = (
              <ComingSoonModal
                trigger={
                  <p className={cn(linkClassName, "cursor-pointer")}>
                    {t(item.label)}
                  </p>
                }
              />
            );
          }

          return <li key={item.label}>{link}</li>;
        })}
      </ul>
    </div>
  );
};

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations("common");

  return (
    <footer aria-labelledby="footer-heading" dir={getLocaleDirection(locale)}>
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <Container className="pt-0 pb-8">
        <div className="border-border border-t pt-12 xl:flex xl:justify-between xl:gap-8">
          <div className="max-w-[400px]">
            <p className="text-foreground leading-6 font-bold">
              {t("footer.headline")}
            </p>

            <p className="text-muted-foreground mt-3 text-sm leading-6">
              {t("footer.description")}
            </p>

            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-3 xl:mt-0">
            <FooterRow
              title={t("navigation.browse.title")}
              items={navigation.browse}
            />
            <FooterRow
              title={t("navigation.about.title")}
              items={navigation.about}
            />
            <FooterRow
              title={t("navigation.contribute.title")}
              items={navigation.contribute}
            />
          </div>
        </div>

        <div className="mt-16 flex w-full items-center justify-between pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-500">
            &copy;{" "}
            {t("footer.copyright", {
              year: new Date().getFullYear(),
            })}
          </p>

          <div className="flex space-x-6">
            {navigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-gray-500"
                title={item.name}
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
