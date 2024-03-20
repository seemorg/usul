import type { NamespaceKeys, NestedKeyOf, useTranslations } from "next-intl";

export type NamespaceTranslations<
  NS extends NamespaceKeys<IntlMessages, NestedKeyOf<IntlMessages>>,
> = Parameters<ReturnType<typeof useTranslations<NS>>>[0];
