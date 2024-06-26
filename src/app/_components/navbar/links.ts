import { config } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import type { NamespaceTranslations } from "@/types/NamespaceTranslations";

export type NavItem = {
  href?: string;
  title: NamespaceTranslations<"common">;
  description: NamespaceTranslations<"common">;
};

export const toolsItems: NavItem[] = [
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

export const exploreItems: NavItem[] = [
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

export const contributeItems: NavItem[] = [
  {
    title: "navigation.contribute.add-text.title",
    description: "navigation.contribute.add-text.description",
    href: `mailto:${config.feedbackEmail}`,
  },
  {
    title: "navigation.contribute.report-mistake.title",
    description: "navigation.contribute.report-mistake.description",
    href: `mailto:${config.feedbackEmail}`,
  },
  {
    title: "navigation.contribute.feedback.title",
    description: "navigation.contribute.feedback.description",
    href: `mailto:${config.feedbackEmail}`,
  },
];
