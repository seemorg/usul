import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import config, { locales, type AppLocale } from "i18n.config";
import { appLocaleToPathLocale } from "./lib/locale/utils";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as AppLocale)) notFound();

  const pathLocale = appLocaleToPathLocale(locale as AppLocale);

  const messages = (
    await Promise.all(
      config.namespaces.map(async (namespace) => {
        const messages = {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          [namespace]: (
            (await import(`../locales/${pathLocale}/${namespace}.json`)) as {
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
    ...getSharedConfig(),
  };
});

export const getSharedConfig = (): Awaited<
  ReturnType<Parameters<typeof getRequestConfig>[0]>
> => {
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
