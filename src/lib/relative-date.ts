import { useCallback, useState } from "react";
import { useFormatter, useLocale } from "next-intl";

const _relativeFormatters = new Map<string, Intl.RelativeTimeFormat>();
const getRelativeFormatterByLocale = (locale: string) => {
  if (_relativeFormatters.has(locale)) {
    return _relativeFormatters.get(locale)!;
  }

  const formatter = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  });
  _relativeFormatters.set(locale, formatter);
  return formatter;
};

export function useFormatRelativeDate() {
  const locale = useLocale();
  const formatter = useFormatter();
  const [now] = useState(() => new Date());

  const formatDay = useCallback(
    (date: Date) => {
      const diffInDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
      );

      // if diff in days is <= 5, return relative date
      if (diffInDays <= 5) {
        const relativeFormatter = getRelativeFormatterByLocale(locale);
        return relativeFormatter.format(diffInDays, "day");
      }

      // otherwise, return Day of week, day of month, month, year. Example: "Tuesday, 24 December 2024"
      return formatter.dateTime(date, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
    [locale, formatter],
  );

  return formatDay;
}
