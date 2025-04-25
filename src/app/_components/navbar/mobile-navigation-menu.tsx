import { useTranslations } from "next-intl";

import {
  
  browseItems,
  contributeItems,
  aboutItems
} from "./links";
import type {NavItem} from "./links";
import { Link } from "@/navigation";
import type { NamespaceTranslations } from "@/types/NamespaceTranslations";
import Container from "@/components/ui/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const t = useTranslations("common");

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((i) => !!i.href),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Container className="py-18">
      <Accordion
        className="w-full"
        type="multiple"
        defaultValue={filteredGroups.map((g) => g.title)}
      >
        {filteredGroups.map((group) => (
          <AccordionItem value={group.title} key={group.title} defaultChecked>
            <AccordionTrigger className="font-semibold">
              {t(group.title)}
            </AccordionTrigger>

            <AccordionContent>
              <ul className="text-muted-foreground flex flex-col gap-3">
                {group.items.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href!}
                    title={t(item.title)}
                    target={
                      item.href!.startsWith("mailto:") ? "_blank" : undefined
                    }
                    className="py-1"
                    prefetch
                    onNavigate={() => setIsMenuOpen(false)}
                  >
                    {t(item.title)}
                  </Link>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Container>
  );
}
