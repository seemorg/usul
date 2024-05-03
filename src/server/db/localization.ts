import type { PathLocale } from "@/lib/locale/utils";

const getLocalizedText = <
  T extends { locale: string; text?: string; texts?: string[] },
>(
  entry: T[],
  locale: string,
): (T extends { text: string } ? string : string[]) | undefined => {
  if (locale) {
    const record = entry?.find((r) => r.locale === locale);
    if (!record) return undefined;

    return ("text" in record ? record.text : record.texts) as any;
  }

  if (entry?.length <= 1) {
    const record = entry[0];
    if (!record) return undefined;

    return ("text" in record ? record.text : record.texts) as any;
  }

  let record = entry[0]!;
  if (record.locale === "en") record = entry[1]!;

  return ("text" in record ? record.text : record.texts) as any;
};

export const getPrimaryLocalizedText = <
  T extends { locale: string; text?: string; texts?: string[] },
>(
  entry: T[],
  locale: PathLocale,
): (T extends { text: string } ? string : string[]) | undefined => {
  const result = getLocalizedText(entry, locale);
  if (result) return result;

  // fallback to english
  return getLocalizedText(entry, "en");
};

export const getSecondaryLocalizedText = <
  T extends { locale: string; text?: string; texts?: string[] },
>(
  entry: T[],
  locale: PathLocale,
): (T extends { text: string } ? string : string[]) | undefined => {
  if (locale === "ar") {
    return;
  }

  const arabic = getLocalizedText(entry, "ar");

  // languages other than arabic should show arabic as a secondary text
  return arabic;
};

export const getLocaleWhereClause = (locale: string) => {
  return {
    where: {
      locale: locale === "en" ? { in: [locale, "ar"] } : { in: [locale, "ar"] },
    },
  };
};
