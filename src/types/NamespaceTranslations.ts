import type {
  NamespaceKeys as NextIntlNamespaceKeys,
  NestedKeyOf,
  useTranslations,
} from "next-intl";

export type NamespaceTranslations<
  NS extends NextIntlNamespaceKeys<IntlMessages, NestedKeyOf<IntlMessages>>,
> = Parameters<ReturnType<typeof useTranslations<NS>>>[0];
