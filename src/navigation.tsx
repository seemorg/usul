import {
  type AppLocale,
  defaultLocale,
  locales,
  localePrefix,
} from "~/i18n.config";
import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { isSameURL } from "./lib/utils";
import NProgress from "nprogress";

const result = createSharedPathnamesNavigation({
  locales,
  localePrefix,
  defaultLocale,
});

export const Link = result.Link;
export const usePathname = result.usePathname;
export const redirect = result.redirect;
export const permanentRedirect = result.permanentRedirect;

export const useRouter = () => {
  const router = result.useRouter();
  const pathname = usePathname();

  function push(
    href: string,
    options?: Parameters<typeof router.push>[1] & { locale?: AppLocale },
    NProgressOptions?: { showProgressBar?: boolean },
  ) {
    if (NProgressOptions?.showProgressBar === false)
      return router.push(href, options);

    const currentUrl = new URL(pathname, location.href);
    const targetUrl = new URL(href, location.href);

    if (isSameURL(targetUrl, currentUrl) || href === pathname)
      return router.push(href, options);

    NProgress.start();
    return router.push(href, options);
  }

  function replace(
    href: string,
    options?: Parameters<typeof router.replace>[1] & { locale?: AppLocale },
    NProgressOptions?: { showProgressBar?: boolean },
  ) {
    if (NProgressOptions?.showProgressBar === false)
      return router.replace(href, options);

    NProgress.start();
    return router.replace(href, options);
  }

  function back(NProgressOptions?: { showProgressBar?: boolean }) {
    if (NProgressOptions?.showProgressBar === false) return router.back();

    NProgress.start();
    return router.back();
  }

  return { ...router, push, back, replace };
};
