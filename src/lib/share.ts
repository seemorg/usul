import { routing } from "@/i18n/config";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { usePathLocale } from "./locale/utils";
import { navigation } from "./urls";

export const useBookShareUrl = () => {
  const pathLocale = usePathLocale();
  const locale = useLocale();
  const t = useTranslations();

  const getUrl = ({
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
    let url = window.location.origin;

    if (locale !== routing.defaultLocale) url = `${url}${pathLocale}/`;
    url += navigation.books.pageReader(slug, pageIndex + 1);

    if (versionId) url += `?versionId=${versionId}`;

    if (selection) {
      // add selection to url via browser query params
      url += `#:~:text=${encodeURIComponent(selection)}`;
    }

    return url;
  };

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
    const url = getUrl({ slug, pageIndex, versionId, selection });
    await navigator.clipboard.writeText(url);

    toast.success(t("reader.chat.copied"));
  };

  return { copyUrl, getUrl };
};
