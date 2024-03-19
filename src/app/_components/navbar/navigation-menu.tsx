import { Logo } from "@/components/Icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import type { NamespaceTranslations } from "@/types/NamespaceTranslations";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import React from "react";

type NavItem = {
  href: string;
  title: NamespaceTranslations<"common">;
  description: NamespaceTranslations<"common">;
};

const toolsItems: NavItem[] = [
  {
    href: "/search",
    title: "navigation.tools.advanced-search.title",
    description: "navigation.tools.advanced-search.description",
  },
  {
    href: "/text-explorer",
    title: "navigation.tools.text-explorer.title",
    description: "navigation.tools.text-explorer.description",
  },
  {
    href: "/author-explorer",
    title: "navigation.tools.author-explorer.title",
    description: "navigation.tools.author-explorer.description",
  },
];

const exploreItems: NavItem[] = [
  {
    href: "/texts",
    title: "navigation.explore.texts.title",
    description: "navigation.explore.texts.description",
  },
  {
    href: "/authors",
    title: "navigation.explore.authors.title",
    description: "navigation.explore.authors.description",
  },
  {
    href: "/regions",
    title: "navigation.explore.regions.title",
    description: "navigation.explore.regions.description",
  },
  {
    href: "/genres",
    title: "navigation.explore.genres.title",
    description: "navigation.explore.genres.description",
  },
];

const contributeItems: NavItem[] = [
  {
    href: "/contribute/add-text",
    title: "navigation.contribute.add-text.title",
    description: "navigation.contribute.add-text.description",
  },
  {
    href: "/contribute/report-mistake",
    title: "navigation.contribute.report-mistake.title",
    description: "navigation.contribute.report-mistake.description",
  },
  {
    href: "/contribute/feedback",
    title: "navigation.contribute.feedback.title",
    description: "navigation.contribute.feedback.description",
  },
];

export default function HomepageNavigationMenu() {
  const t = useTranslations("common");

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {t("navigation.tools.title")}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3 min-h-[250px]">
                <NavigationMenuLink className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                  <EnvelopeIcon className="h-6 w-6" />

                  <div className="mb-2 mt-4 text-lg font-medium">
                    {t("navigation.tools.get-notified.title")}
                  </div>
                  <p className="text-sm leading-tight text-muted-foreground">
                    {t("navigation.tools.get-notified.description")}
                  </p>
                </NavigationMenuLink>
              </li>

              {toolsItems.map((item) => (
                <ListItem
                  key={item.href}
                  href={item.href}
                  title={t(item.title)}
                >
                  {t(item.description)}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {t("navigation.explore.title")}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {exploreItems.map((item) => (
                <ListItem
                  key={item.href}
                  title={t(item.title)}
                  href={item.href}
                >
                  {t(item.description)}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {t("navigation.contribute.title")}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3 min-h-[250px]">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="https://digitalseem.org"
                    target="_blank"
                  >
                    <Logo className="h-auto w-6" />

                    <div className="mb-2 mt-4 text-lg font-medium">
                      {t("navigation.contribute.about.title")}
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      {t("navigation.contribute.about.description")}
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>

              {contributeItems.map((item) => (
                <ListItem
                  key={item.title}
                  title={t(item.title)}
                  href={item.href}
                >
                  {t(item.description)}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
