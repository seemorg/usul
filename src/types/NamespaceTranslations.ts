import type {
  Messages,
  NestedKeyOf,
  NamespaceKeys as NextIntlNamespaceKeys,
  useTranslations,
} from "next-intl";

export type NamespaceTranslations<
  NS extends NextIntlNamespaceKeys<Messages, NestedKeyOf<Messages>>,
> = Parameters<ReturnType<typeof useTranslations<NS>>>[0];
