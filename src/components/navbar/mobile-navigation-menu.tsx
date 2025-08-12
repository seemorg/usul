import type { NamespaceTranslations } from "@/types/NamespaceTranslations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EntityAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { BadgeCheckIcon, FolderIcon, LogOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { NavItem } from "./links";
import { aboutItems, browseItems, contributeItems } from "./links";
import { useLogout } from "./profile-dropdown";

const groups: {
  title: NamespaceTranslations<"common">;
  items: NavItem[];
}[] = [
  {
    title: "navigation.browse.title",
    items: browseItems,
  },
  {
    title: "navigation.about.title",
    items: aboutItems,
  },
  {
    title: "navigation.contribute.title",
    items: contributeItems,
  },
];

export default function MobileNavigationMenu({
  setIsMenuOpen,
}: {
  setIsMenuOpen: (isMenuOpen: boolean) => void;
}) {
  const t = useTranslations();
  const session = useSession();
  const { handleSignOut, isSigningOut } = useLogout();

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((i) => !!i.href),
    }))
    .filter((group) => group.items.length > 0);

  const signOut = async () => {
    await handleSignOut();
    setIsMenuOpen(false);
  };

  return (
    <Container className="py-18">
      {/* Profile Section - Always First and Expanded */}
      <div className="border-border mt-5 mb-3 border-b pb-3">
        {session.isPending ? (
          <div className="flex items-center gap-3 py-2">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
          </div>
        ) : session.data ? (
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-3 py-2">
              <EntityAvatar type="user" entity={session.data.user} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                {session.data.user.name ? (
                  <>
                    <span className="truncate font-semibold">
                      {session.data.user.name}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {session.data.user.email}
                    </span>
                  </>
                ) : (
                  <span className="truncate font-semibold">
                    {session.data.user.email}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Links */}
            <div className="space-y-1">
              <Link
                href={navigation.profile()}
                className="flex items-center gap-2 py-2 text-sm"
                onNavigate={() => setIsMenuOpen(false)}
              >
                <BadgeCheckIcon className="size-4" />
                {t("common.profile")}
              </Link>
              <Link
                href={navigation.collections.all()}
                className="flex items-center gap-2 py-2 text-sm"
                onNavigate={() => setIsMenuOpen(false)}
              >
                <FolderIcon className="size-4" />
                {t("entities.collections")}
              </Link>
              <button
                onClick={signOut}
                disabled={isSigningOut}
                className="flex w-full items-center gap-2 py-2 text-left text-sm"
              >
                <LogOutIcon className="size-4" />
                {t("common.logout")}
              </button>
            </div>
          </div>
        ) : (
          <Button asChild className="w-full">
            <Link
              href={navigation.login()}
              onNavigate={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </Button>
        )}
      </div>

      {/* Navigation Sections */}
      <Accordion
        className="w-full"
        type="multiple"
        defaultValue={filteredGroups.map((g) => g.title)}
      >
        {filteredGroups.map((group) => (
          <AccordionItem value={group.title} key={group.title} defaultChecked>
            <AccordionTrigger className="font-semibold">
              {t(`common.${group.title}`)}
            </AccordionTrigger>

            <AccordionContent>
              <ul className="text-muted-foreground flex flex-col gap-3">
                {group.items.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href!}
                    title={t(`common.${item.title}`)}
                    target={
                      item.href!.startsWith("mailto:") ? "_blank" : undefined
                    }
                    className="py-1"
                    prefetch
                    onNavigate={() => setIsMenuOpen(false)}
                  >
                    {t(`common.${item.title}`)}
                  </Link>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Link
        href={navigation.chat.all()}
        className="flex w-full items-center justify-start gap-2 py-4 text-sm font-semibold"
      >
        {t("chat.input.ai_chat")}
        <span className="bg-primary-foreground text-primary rounded-full px-2 py-0.5 text-xs">
          {t("common.new")}
        </span>
      </Link>
    </Container>
  );
}
