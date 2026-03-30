import type { NamespaceTranslations } from "@/types/NamespaceTranslations";
import { AIRTABLE_FORMS } from "@/lib/constants";
import { SITE_CONFIG } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { navigation as urls } from "@/lib/urls";
import {
  BookOpenIcon,
  CirclePlusIcon,
  FileTextIcon,
  GlobeIcon,
  HandCoinsIcon,
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
  isDemo?: boolean;
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
  {
    href: navigation.empires.all(),
    title: "navigation.browse.empires.title",
    description: "navigation.browse.empires.description",
    icon: GlobeIcon,
  }
];

export const aboutItems: NavItem[] = [
  {
    title: "navigation.about.vision.title",
    description: "navigation.about.vision.description",
    icon: FileTextIcon,
    href: navigation.vision(),
  },
  {
    title: "navigation.about.team.title",
    description: "navigation.about.team.description",
    icon: UsersIcon,
    href: navigation.team(),
  },
  {
    title: "navigation.about.demo.title",
    description: "navigation.about.demo.description",
    icon: PlayIcon,
    isDemo: true,
  },
  {
    title: "navigation.about.contact.title",
    description: "navigation.about.contact.description",
    icon: MailIcon,
    href: urls.form(AIRTABLE_FORMS.FEEDBACK.id),
  },
];

export const contributeItems: NavItem[] = [
  {
    title: "navigation.contribute.donate.title",
    description: "navigation.contribute.donate.description",
    href: navigation.donate(),
    icon: HandCoinsIcon,
  },
  {
    title: "navigation.contribute.add-text.title",
    description: "navigation.contribute.add-text.description",
    href: urls.form(AIRTABLE_FORMS.ADD_TEXT.id),
    icon: CirclePlusIcon,
  },
  {
    title: "navigation.contribute.report-mistake.title",
    description: "navigation.contribute.report-mistake.description",
    href: urls.form(AIRTABLE_FORMS.REPORT_MISTAKE.id),
    icon: ShieldAlertIcon,
  },
  {
    title: "navigation.contribute.feedback.title",
    description: "navigation.contribute.feedback.description",
    href: urls.form(AIRTABLE_FORMS.FEEDBACK.id),
    icon: MessageSquarePlusIcon,
  },
  {
    title: "navigation.contribute.volunteer.title",
    description: "navigation.contribute.volunteer.description",
    href: urls.form(AIRTABLE_FORMS.VOLUNTEER.id),
    icon: HeartHandshakeIcon,
  },
];
