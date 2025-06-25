import type { PathLocale } from "./locale/utils";

// Refer original code
// https://github.com/OpenSID/OpenSID/blob/master/donjo-app/libraries/Date_conv.php#L44
const hijriToJulian = (year: number, month: number, day: number) => {
  return (
    Math.floor((11 * year + 3) / 30) +
    Math.floor(354 * year) +
    Math.floor(30 * month) -
    Math.floor((month - 1) / 2) +
    day +
    1948440 -
    386
  );
};

const gregorianToJulian = (year: number, month: number, day: number) => {
  if (month < 3) {
    year -= 1;
    month += 12;
  }

  const a = Math.floor(year / 100.0);
  const b =
    year === 1582 && (month > 10 || (month === 10 && day > 4))
      ? -10
      : year === 1582 && month === 10
        ? 0
        : year < 1583
          ? 0
          : 2 - a + Math.floor(a / 4.0);

  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    b -
    1524
  );
};

const julianToHijri = (julianDay: number) => {
  const y = 10631.0 / 30.0;
  const epochAstro = 1948084;
  const shift1 = 8.01 / 60.0;

  let z = julianDay - epochAstro;
  const cyc = Math.floor(z / 10631.0);
  z -= 10631 * cyc;
  const j = Math.floor((z - shift1) / y);
  z -= Math.floor(j * y + shift1);

  const year = 30 * cyc + j;
  let month = Math.floor(parseInt(((z + 28.5001) / 29.5) as any));
  if (month === 13) {
    month = 12;
  }

  const day = z - Math.floor(29.5001 * month - 29);

  return {
    year: parseInt(year as any),
    month: parseInt(month as any),
    day: parseInt(day as any),
  };
};

const julianToGregorian = (julianDate: number) => {
  let b = 0;
  if (julianDate > 2299160) {
    const a = Math.floor((julianDate - 1867216.25) / 36524.25);
    b = 1 + a - Math.floor(a / 4.0);
  }

  const bb = julianDate + b + 1524;
  let cc = Math.floor((bb - 122.1) / 365.25);
  const dd = Math.floor(365.25 * cc);
  const ee = Math.floor((bb - dd) / 30.6001);

  const day = bb - dd - Math.floor(30.6001 * ee);
  let month = ee - 1;

  if (ee > 13) {
    cc += 1;
    month = ee - 13;
  }

  const year = cc - 4716;

  return {
    year: parseInt(year as any),
    month: parseInt(month as any),
    day: parseInt(day as any),
  };
};

export const gregorianYearToHijriYear = (gregorianYear: number) => {
  const gregorianMonth = 1;
  const gregorianDay = 1;

  const julianDay = gregorianToJulian(
    gregorianYear,
    gregorianMonth,
    gregorianDay,
  );

  const hijriDate = julianToHijri(julianDay);

  return hijriDate.year;
};

export function hijriYearToGregorianYear(hijriYear: number): number {
  // Assuming the start of the Hijri year (1st Muharram)
  const hijriMonth = 1; // Muharram
  const hijriDay = 1;

  // Convert Hijri date to Julian day
  const julianDay = hijriToJulian(hijriYear, hijriMonth, hijriDay);

  // Convert Julian day to Gregorian date
  const gregorianDate = julianToGregorian(julianDay);

  return gregorianDate.year;
}

export const formatDeathYear = (
  year?: number | null,
  locale: PathLocale = "en",
) => {
  const isUnknown = !year || year <= 0;
  const prefix = locale === "ar" ? "ت." : "d.";
  if (isUnknown) {
    return `${prefix} ${locale === "ar" ? "غير معلوم" : "Unknown"}`;
  }

  if (locale === "ar") {
    return `${prefix} ${year} / ${hijriYearToGregorianYear(year)}`;
  }

  return `${prefix} ${year} / ${hijriYearToGregorianYear(year)}`;
};

export const secondsToMsDate = (seconds: number) => new Date(seconds * 1000);

export const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
};
