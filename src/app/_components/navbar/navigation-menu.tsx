import React from "react";
import ComingSoonModal from "@/components/coming-soon-modal";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useTotalEntities } from "@/contexts/total-entities.context";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { useDemo } from "@/stores/demo";
import { useTranslations } from "next-intl";

import type { NavItem } from "./links";
import { aboutItems, browseItems, contributeItems } from "./links";

export default function HomepageNavigationMenu() {
  const t = useTranslations("common");
  const setDemo = useDemo((s) => s.setIsOpen);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const total = useTotalEntities();

  const renderItem = (item: NavItem, idx: number) => {
    if (item.href) {
      return (
        <ListItem
          key={idx}
          href={item.href}
          icon={item.icon}
          title={t(item.title)}
          target={item.href.startsWith("mailto:") ? "_blank" : undefined}
        >
          {t(item.description, total)}
        </ListItem>
      );
    }

    if (item.isDemo) {
      return (
        <ListItem
          key={idx}
          onClick={() => setDemo(true)}
          icon={item.icon}
          title={t(item.title)}
          className="cursor-pointer"
        >
          {t(item.description, total)}
        </ListItem>
      );
    }

    return (
      <ListItem
        key={idx}
        href={item.href}
        icon={item.icon}
        title={t(item.title)}
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer"
      >
        {t(item.description, total)}
      </ListItem>
    );
  };

  return (
    <NavigationMenu orientation="vertical">
      <ComingSoonModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      <NavigationMenuList>
        <NavigationMenuItem value="1">
          <NavigationMenuTrigger>
            {t("navigation.browse.title")}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="flex w-[200px] flex-col gap-1 p-2">
              {browseItems.map(renderItem)}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem value="2">
          <NavigationMenuTrigger>
            {t("navigation.about.title")}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="flex w-[210px] flex-col gap-1 p-2">
              {aboutItems.map(renderItem)}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem value="3">
          <NavigationMenuTrigger>
            {t("navigation.contribute.title")}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="flex w-[230px] flex-col gap-1 p-2">
              {contributeItems.map(renderItem)}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = ({
  className,
  title,
  children,
  icon: Icon,
  ref,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href" | "title"> & {
  href?: string;
  title?: React.ReactNode;
  icon?: React.ElementType;
}) => {
  const Comp = props.href ? Link : "div";

  return (
    <li>
      <NavigationMenuLink asChild>
        <Comp
          // @ts-ignore
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
            className,
          )}
          {...props}
        >
          <div className="flex items-center gap-4">
            {Icon && <Icon className="size-5" strokeWidth={1.5} />}

            <div className="space-y-1">
              <div className="text-sm leading-none font-medium">{title}</div>
              <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">
                {children}
              </p>
            </div>
          </div>
        </Comp>
      </NavigationMenuLink>
    </li>
  );
};
