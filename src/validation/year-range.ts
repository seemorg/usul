import { gregorianYearToHijriYear } from "@/lib/date";
import { z } from "zod";

const defaultYear = [1, gregorianYearToHijriYear(new Date().getFullYear())] as [
  number,
  number,
];

export const yearRangeSchema = z
  .string()
  .transform((v) => {
    const [from, to] = v.split("-");
    if (from === undefined || to === undefined) return defaultYear;

    const fromNum = parseInt(from);
    const toNum = parseInt(to);

    if (isNaN(fromNum) || isNaN(toNum)) return defaultYear;

    if (fromNum > toNum) return defaultYear;

    if (fromNum < 1 || toNum < 1) return defaultYear;

    return [fromNum, toNum] as [number, number];
  })
  .catch(defaultYear);
