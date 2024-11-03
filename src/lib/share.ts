import { useLocale, useTranslations } from "next-intl";
import { usePathLocale } from "./locale/utils";
import { navigation } from "./urls";
import { defaultLocale } from "~/i18n.config";
import { toast } from "@/components/ui/use-toast";

export const useBookShareUrl = () => {
  const pathLocale = usePathLocale();
  const locale = useLocale();
  const t = useTranslations();

  const copyUrl = async ({
    slug,
    pageIndex,
    versionId,
    selection,
  }: {
    slug: string;
    pageIndex: number;
    versionId?: string;
    selection?: string;
  }) => {
    let url =
      window.location.origin + navigation.books.pageReader(slug, pageIndex + 1);

    if (locale !== defaultLocale) url = pathLocale + url;
    if (versionId) url = url + `?versionId=${versionId}`;

    if (selection) {
      // add selection to url via browser query params
      url = url + `#:~:text=${encodeURIComponent(selection)}`;
    }

    await navigator.clipboard.writeText(url);

    toast({ description: t("reader.chat.copied") });
  };

  return { copyUrl };
};
