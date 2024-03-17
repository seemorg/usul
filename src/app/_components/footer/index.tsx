import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { getLocaleDirection } from "@/lib/locale";
import { useLocale } from "next-intl";
import type { AppLocale } from "~/i18n.config";

const navigation = {
  tools: [
    { label: "Advanced Search", href: "#" },
    { label: "Text Explorer", href: "#" },
    { label: "Author Explorer", href: "#" },
  ],
  explore: [
    { label: "Texts", href: "#" },
    { label: "Authors", href: "#" },
    { label: "Regions", href: "#" },
    { label: "Genres", href: "#" },
  ],
  contribute: [
    { label: "Add Text", href: "#" },
    { label: "Report Mistake", href: "#" },
    { label: "Develop", href: "#" },
    { label: "Feedback", href: "#" },
  ],
  // about: [
  //   { name: "About the project", href: "#" },
  //   { name: "Who we are", href: "#" },
  // ],
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

const FooterRow = ({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) => (
  <div className="w-fit xl:mx-auto">
    <h3 className="text-sm font-bold leading-6 text-foreground">{title}</h3>

    <ul role="list" className="mt-6 space-y-4">
      {items.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            className="text-sm leading-6 text-muted-foreground hover:text-secondary-foreground"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  const locale = useLocale() as AppLocale;

  return (
    <footer aria-labelledby="footer-heading" dir={getLocaleDirection(locale)}>
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <Container className="pb-8 pt-0">
        <div className="border-t border-border pt-12 xl:flex xl:justify-between xl:gap-8">
          <div className="max-w-[400px]">
            <p className="font-bold leading-6 text-foreground">
              Read, study, and learn The Noble Quran.
            </p>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Quran.com is a Sadaqah Jariyah. We hope to make it easy for
              everyone to read, study, and learn The Noble Quran. The Noble
              Quran has many names including Al-Quran Al-Kareem, Al-Ketab,
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Al-Furqan, Al-Maw'itha, Al-Thikr, and Al-Noor.
            </p>

            <div className="mt-5">
              <form className="flex gap-4 sm:max-w-md">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <Input placeholder="Email address" />

                <div className="flex-shrink-0">
                  <Button variant="default">Subscribe</Button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-3 xl:mt-0">
            <FooterRow title="Tools" items={navigation.tools} />
            <FooterRow title="Explore" items={navigation.explore} />
            <FooterRow title="Contribute" items={navigation.contribute} />
          </div>

          {/* <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  About
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.about.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div> */}
        </div>
        {/* </div> */}

        <div className="mt-16 flex w-full items-center justify-between pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} Seemorg Foundation. All rights
            reserved.
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
