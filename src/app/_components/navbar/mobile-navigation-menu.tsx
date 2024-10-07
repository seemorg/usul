"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { type NavItem, browseItems, contributeItems } from "./links";
import { Link } from "@/navigation";
import ComingSoonModal from "@/components/coming-soon-modal";
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
  // {
  //   title: "navigation.tools.title",
  //   items: toolsItems,
  // },
  {
    title: "navigation.browse.title",
    items: browseItems,
  },
  {
    title: "navigation.contribute.title",
    items: contributeItems,
  },
];

export default function MobileNavigationMenu() {
  const t = useTranslations("common");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderItem = (item: NavItem, idx: number) => {
    const className = "py-1";

    return (
      <Link
        key={idx}
        href={item.href!}
        title={t(item.title)}
        target={item.href!.startsWith("mailto:") ? "_blank" : undefined}
        className={className}
        prefetch
      >
        {t(item.title)}
      </Link>
    );
  };

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((i) => !!i.href),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Container className="py-24">
      <ComingSoonModal open={isModalOpen} onOpenChange={setIsModalOpen} />

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
              <ul className="flex flex-col gap-3 text-muted-foreground">
                {group.items.filter((i) => !!i.href).map(renderItem)}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* <div className="flex flex-col gap-10">
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="text-xs font-semibold">{t(group.title)}</h2>

            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground ltr:ml-3 rtl:mr-3">
              {group.items.map(renderItem)}
            </ul>
          </div>
        ))}
      </div> */}
    </Container>
  );
}
