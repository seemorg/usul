import { config } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import type { NamespaceTranslations } from "@/types/NamespaceTranslations";
import {
  BadgePlusIcon,
  BookOpenIcon,
  FileTextIcon,
  ListIcon,
  MailIcon,
  MapIcon,
  MessageSquarePlusIcon,
  PlayIcon,
  ShieldAlertIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

export type NavItem = {
  href?: string;
  title: NamespaceTranslations<"common">;
  description: NamespaceTranslations<"common">;
  icon?: React.ElementType;
};

export const aboutItems: NavItem[] = [
  {
    title: "navigation.about.about.title",
    description: "navigation.about.about.description",
    icon: FileTextIcon,
  },
  {
    title: "navigation.about.team.title",
    description: "navigation.about.team.description",
    icon: UsersIcon,
    href: navigation.books.all(),
  },
  {
    title: "navigation.about.demo.title",
    description: "navigation.about.demo.description",
    icon: PlayIcon,
    href: navigation.authors.all(),
  },
];

export const browseItems: NavItem[] = [
  {
    href: navigation.books.all(),
    title: "navigation.browse.texts.title",
    description: "navigation.browse.texts.description",
    icon: BookOpenIcon,
  },
  {
    href: navigation.authors.all(),
    title: "navigation.browse.authors.title",
    description: "navigation.browse.authors.description",
    icon: UserIcon,
  },
  {
    href: navigation.regions.all(),
    title: "navigation.browse.regions.title",
    description: "navigation.browse.regions.description",
    icon: MapIcon,
  },
  {
    href: navigation.genres.all(),
    title: "navigation.browse.genres.title",
    description: "navigation.browse.genres.description",
    icon: ListIcon,
  },
];

export const contributeItems: NavItem[] = [
  {
    title: "navigation.contribute.add-text.title",
    description: "navigation.contribute.add-text.description",
    href: `mailto:${config.feedbackEmail}`,
    icon: BadgePlusIcon,
  },
  {
    title: "navigation.contribute.report-mistake.title",
    description: "navigation.contribute.report-mistake.description",
    href: `mailto:${config.feedbackEmail}`,
    icon: ShieldAlertIcon,
  },
  {
    title: "navigation.contribute.feedback.title",
    description: "navigation.contribute.feedback.description",
    href: `mailto:${config.feedbackEmail}`,
    icon: MessageSquarePlusIcon,
  },
  {
    title: "navigation.contribute.contact.title",
    description: "navigation.contribute.contact.description",
    href: `mailto:${config.feedbackEmail}`,
    icon: MailIcon,
  },
];
