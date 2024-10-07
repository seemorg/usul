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
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import React from "react";
import {
  type NavItem,
  // toolsItems,
  browseItems,
  contributeItems,
} from "./links";

export default function HomepageNavigationMenu() {
  const t = useTranslations("common");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const renderItem = (item: NavItem, idx: number) => {
    if (item.href) {
      return (
        <ListItem
          key={idx}
          href={item.href}
          title={t(item.title)}
          target={item.href.startsWith("mailto:") ? "_blank" : undefined}
        >
          {t(item.description)}
        </ListItem>
      );
    }

    return (
      <ListItem
        key={idx}
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
            {t("navigation.browse.title")}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {browseItems.map(renderItem)}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {t("navigation.about.title")}
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
                    {t("navigation.about.get-notified.title")}
                  </div>
                  <p className="text-sm leading-tight text-muted-foreground">
                    {t("navigation.about.get-notified.description")}
                  </p>
                </NavigationMenuLink>
              </li>

              {/* {toolsItems.map(renderItem)} */}
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
