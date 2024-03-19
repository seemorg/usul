import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import config, { locales, type AppLocale } from "i18n.config";
import type { IntlConfig } from "next-intl";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as AppLocale)) notFound();

  const messages = (
    await Promise.all(
      config.namespaces.map(async (namespace) => {
        const messages = {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          [namespace]: (
            (await import(`../locales/${locale}/${namespace}.json`)) as {
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
    ...getSharedConfig(),
  };
});

export const getSharedConfig = (): Omit<IntlConfig, "locale"> => {
  return {
    timeZone: "UTC",
    formats: {
      number: {
        nogroup: {
          useGrouping: false,
        },
      },
    },
  };
};
