import { config } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import type { NamespaceTranslations } from "@/types/NamespaceTranslations";
import {
  BookOpenIcon,
  CirclePlusIcon,
  FileTextIcon,
  HeartHandshakeIcon,
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
    href: navigation.genres.all(),
    title: "navigation.browse.genres.title",
    description: "navigation.browse.genres.description",
    icon: ListIcon,
  },
  {
    href: navigation.regions.all(),
    title: "navigation.browse.regions.title",
    description: "navigation.browse.regions.description",
    icon: MapIcon,
  },
];

export const aboutItems: NavItem[] = [
  {
    title: "navigation.about.about.title",
    description: "navigation.about.about.description",
    icon: FileTextIcon,
    href: navigation.about(),
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
  {
    title: "navigation.about.contact.title",
    description: "navigation.about.contact.description",
    icon: MailIcon,
    href: `mailto:${config.feedbackEmail}`,
  },
];

export const contributeItems: NavItem[] = [
  {
    title: "navigation.contribute.add-text.title",
    description: "navigation.contribute.add-text.description",
    href: `mailto:${config.feedbackEmail}`,
    icon: CirclePlusIcon,
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
    title: "navigation.contribute.volunteer.title",
    description: "navigation.contribute.volunteer.description",
    // href: `mailto:${config.feedbackEmail}`,
    icon: HeartHandshakeIcon,
  },
];
