import { defaultLocale, type AppLocale } from "~/i18n.config";
import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { useLocale } from "next-intl";
import { isSameURL } from "./lib/utils";
import NProgress from "nprogress";
import {
  PATH_LOCALES,
  supportedBcp47LocaleToPathLocale,
} from "./lib/locale/utils";

const result = createSharedPathnamesNavigation({ locales: PATH_LOCALES });

export const Link = ({
  locale,
  ...props
}: Parameters<typeof result.Link>[0] & { locale?: AppLocale }) => {
  const currentLocale = useLocale();
  const bcp47Locale = locale ?? currentLocale;

  return (
    <result.Link
      {...props}
      {...((!locale && currentLocale === defaultLocale) ||
      locale === defaultLocale
        ? {}
        : {
            locale: supportedBcp47LocaleToPathLocale(bcp47Locale as AppLocale),
          })}
    />
  );
};

export const usePathname = () => {
  const pathname = result.usePathname();
  const pathLocale = PATH_LOCALES.find((locale) =>
    pathname.startsWith(`/${locale}`),
  );

  return pathLocale
    ? pathname.replace(new RegExp(`^/${pathLocale}/?`), "/")
    : pathname;
};

export const redirect = result.redirect;

const mapToPathLocale = <T extends { locale?: AppLocale }>(
  currentLocale: AppLocale,
  { locale, ...options }: T,
): Omit<T, "locale"> & { locale?: string } => {
  const bcp47Locale = locale ?? currentLocale;
  return { ...options, locale: supportedBcp47LocaleToPathLocale(bcp47Locale) };
};

export const useRouter = () => {
  const currentLocale = useLocale() as AppLocale;
  const router = result.useRouter();
  const pathname = usePathname();

  function push(
    href: string,
    options?: Parameters<typeof router.push>[1] & { locale?: AppLocale },
    NProgressOptions?: { showProgressBar?: boolean },
  ) {
    const mappedOptions = mapToPathLocale(currentLocale, options ?? {});

    if (NProgressOptions?.showProgressBar === false)
      return router.push(href, mappedOptions);

    const currentUrl = new URL(pathname, location.href);
    const targetUrl = new URL(href, location.href);

    if (isSameURL(targetUrl, currentUrl) || href === pathname)
      return router.push(href, mappedOptions);

    NProgress.start();

    return router.push(href, mappedOptions);
  }

  function replace(
    href: string,
    options?: Parameters<typeof router.replace>[1] & { locale?: AppLocale },
    NProgressOptions?: { showProgressBar?: boolean },
  ) {
    const mappedOptions = mapToPathLocale(currentLocale, options ?? {});

    if (NProgressOptions?.showProgressBar === false)
      return router.replace(href, mappedOptions);

    NProgress.start();

    return router.replace(href, mappedOptions);
  }

  function back(NProgressOptions?: { showProgressBar?: boolean }) {
    if (NProgressOptions?.showProgressBar === false) return router.back();

    NProgress.start();

    return router.back();
  }

  function prefetch(
    href: Parameters<typeof router.prefetch>[0],
    options: Parameters<typeof router.prefetch>[1] & { locale?: AppLocale },
  ) {
    const mappedOptions = mapToPathLocale(currentLocale, options ?? {});

    router.prefetch(href, mappedOptions);
  }

  return { ...router, push, back, replace, prefetch };
};
