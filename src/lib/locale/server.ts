"use server";

import { getLocale } from "next-intl/server";
import { appLocaleToPathLocale } from "./utils";

export const getPathLocale = async () => {
  const locale = await getLocale();
  return appLocaleToPathLocale(locale);
};
