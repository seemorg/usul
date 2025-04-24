import { getRequestConfig } from "next-intl/server";
import config, { routing } from "./config";
import { appLocaleToPathLocale } from "@/lib/locale/utils";
import { hasLocale } from "next-intl";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const pathLocale = appLocaleToPathLocale(locale);

  const messages = (
    await Promise.all(
      config.namespaces.map(async (namespace) => {
        const messages = {
          [namespace]: (
            (await import(`../../locales/${pathLocale}/${namespace}.json`)) as {
              default: Record<string, string>;
            }
          ).default,
        };
        return messages;
      }),
    )
  ).reduce((acc, val) => ({ ...acc, ...val }), {});

  return {
    messages,
    locale,
    timeZone: "UTC",
    formats: {
      number: {
        nogroup: {
          useGrouping: false,
        },
      },
    },
  };
});
