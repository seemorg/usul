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
import { navigation } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { useDemo } from "@/stores/demo";
import { useTranslations } from "next-intl";

import type { NavItem } from "./links";
import { aboutItems, browseItems, contributeItems } from "./links";

export default function HomepageNavigationMenu() {
  const t = useTranslations();
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
          title={t(`common.${item.title}`)}
          target={item.href.startsWith("mailto:") ? "_blank" : undefined}
        >
          {t(`common.${item.description}`, total)}
        </ListItem>
      );
    }

    if (item.isDemo) {
      return (
        <ListItem
          key={idx}
          onClick={() => setDemo(true)}
          icon={item.icon}
          title={t(`common.${item.title}`)}
          className="cursor-pointer"
        >
          {t(`common.${item.description}`, total)}
        </ListItem>
      );
    }

    return (
      <ListItem
        key={idx}
        href={item.href}
        icon={item.icon}
        title={t(`common.${item.title}`)}
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer"
      >
        {t(`common.${item.description}`, total)}
      </ListItem>
    );
  };

  return (
    <NavigationMenu orientation="vertical">
      <ComingSoonModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      <NavigationMenuList>
        <NavigationMenuItem value="1">
          <NavigationMenuTrigger>
            {t("common.navigation.browse.title")}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="flex w-[200px] flex-col gap-1 p-2">
              {browseItems.map(renderItem)}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem value="2">
          <NavigationMenuTrigger>
            {t("common.navigation.about.title")}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="flex w-[210px] flex-col gap-1 p-2">
              {aboutItems.map(renderItem)}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem value="3">
          <NavigationMenuTrigger>
            {t("common.navigation.contribute.title")}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="flex w-[230px] flex-col gap-1 p-2">
              {contributeItems.map(renderItem)}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuLink asChild>
          <Link
            href={navigation.chat.all()}
            className="group hover:bg-accent/10 focus:bg-accent/10 data-active:bg-accent/10 data-[state=open]:bg-accent/10 inline-flex h-9 w-max items-center justify-center gap-2 rounded-md bg-transparent px-2 py-2 text-sm font-medium transition-colors focus:outline-hidden disabled:pointer-events-none disabled:opacity-5"
          >
            {t("chat.input.ai_chat")}
            <span className="bg-primary-foreground text-primary rounded-full px-2 py-0.5 text-xs">
              {t("common.new")}
            </span>
          </Link>
        </NavigationMenuLink>
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
