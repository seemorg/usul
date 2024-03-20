import { Logo } from "@/components/Icons";
import ComingSoonModal from "@/components/coming-soon-modal";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import type { NamespaceTranslations } from "@/types/NamespaceTranslations";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import React from "react";

type NavItem = {
  href?: string;
  title: NamespaceTranslations<"common">;
  description: NamespaceTranslations<"common">;
};

const toolsItems: NavItem[] = [
  {
    title: "navigation.tools.advanced-search.title",
    description: "navigation.tools.advanced-search.description",
  },
  {
    title: "navigation.tools.text-explorer.title",
    description: "navigation.tools.text-explorer.description",
    href: navigation.books.all(),
  },
  {
    title: "navigation.tools.author-explorer.title",
    description: "navigation.tools.author-explorer.description",
    href: navigation.authors.all(),
  },
];

const exploreItems: NavItem[] = [
  {
    href: navigation.books.all(),
    title: "navigation.explore.texts.title",
    description: "navigation.explore.texts.description",
  },
  {
    href: navigation.authors.all(),
    title: "navigation.explore.authors.title",
    description: "navigation.explore.authors.description",
  },
  {
    href: navigation.regions.all(),
    title: "navigation.explore.regions.title",
    description: "navigation.explore.regions.description",
  },
  {
    href: navigation.genres.all(),
    title: "navigation.explore.genres.title",
    description: "navigation.explore.genres.description",
  },
];

const contributeItems: NavItem[] = [
  {
    title: "navigation.contribute.add-text.title",
    description: "navigation.contribute.add-text.description",
  },
  {
    title: "navigation.contribute.report-mistake.title",
    description: "navigation.contribute.report-mistake.description",
  },
  {
    title: "navigation.contribute.feedback.title",
    description: "navigation.contribute.feedback.description",
  },
];

export default function HomepageNavigationMenu() {
  const t = useTranslations("common");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const renderItem = (item: NavItem) => {
    if (item.href) {
      return (
        <ListItem key={item.href} href={item.href} title={t(item.title)}>
          {t(item.description)}
        </ListItem>
      );
    }

    return (
      <ListItem
        key={item.href}
        href={item.href}
        title={t(item.title)}
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer"
      >
        {t(item.description)}
      </ListItem>
    );
  };

  return (
    <NavigationMenu>
      <ComingSoonModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {t("navigation.tools.title")}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li
                className="row-span-3 min-h-[250px] cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
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

              {toolsItems.map(renderItem)}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {t("navigation.explore.title")}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {exploreItems.map(renderItem)}
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

              {contributeItems.map(renderItem)}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> & {
    href?: string;
  }
>(({ className, title, children, ...props }, ref) => {
  const Comp = props.href ? Link : "p";

  return (
    <li>
      <NavigationMenuLink asChild>
        <Comp
          // @ts-ignore
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
        </Comp>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
