import ComingSoonModal from "@/components/coming-soon-modal";
import NewsletterForm from "@/components/newsletter-form";
import Container from "@/components/ui/container";
import { getLocaleDirection } from "@/lib/locale/utils";
import { config } from "@/lib/seo";
import { navigation as urls } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import type { NamespaceTranslations } from "@/types/NamespaceTranslations";
import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "~/i18n.config";

type NavItem = {
  label: NamespaceTranslations<"common">;
  href?: string;
};

const navigation = {
  about: [
    {
      label: "navigation.about.about.title",
      href: urls.about(),
    },
    {
      label: "navigation.about.team.title",
    },
    {
      label: "navigation.about.demo.title",
    },
    {
      label: "navigation.about.contact.title",
      href: `mailto:${config.contactEmail}`,
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
      href: `mailto:${config.feedbackEmail}`,
    },
    {
      label: "navigation.contribute.report-mistake.title",
      href: `mailto:${config.feedbackEmail}`,
    },
    {
      label: "navigation.contribute.feedback.title",
      href: `mailto:${config.feedbackEmail}`,
    },
    {
      label: "navigation.contribute.volunteer.title",
    },
  ] satisfies NavItem[],
  social: [
    {
      name: "GitHub",
      href: "https://github.com/seemorg",
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
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
      <h3 className="text-sm font-bold leading-6 text-foreground">{title}</h3>

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
  const locale = useLocale() as AppLocale;
  const t = useTranslations("common");

  return (
    <footer aria-labelledby="footer-heading" dir={getLocaleDirection(locale)}>
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <Container className="pb-8 pt-0">
        <div className="border-t border-border pt-12 xl:flex xl:justify-between xl:gap-8">
          <div className="max-w-[400px]">
            <p className="font-bold leading-6 text-foreground">
              {t("footer.headline")}
            </p>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
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
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
