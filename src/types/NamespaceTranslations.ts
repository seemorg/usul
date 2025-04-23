import type {
  NamespaceKeys as NextIntlNamespaceKeys,
  NestedKeyOf,
  useTranslations,
  Messages,
} from "next-intl";

export type NamespaceTranslations<
  NS extends NextIntlNamespaceKeys<Messages, NestedKeyOf<Messages>>,
> = Parameters<ReturnType<typeof useTranslations<NS>>>[0];
