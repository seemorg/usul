"use server";

import { getLocale as baseGetLocale } from "next-intl/server";
import type { AppLocale } from "~/i18n.config";
import { appLocaleToPathLocale } from "./utils";

export const getLocale = async () => {
  const locale = await baseGetLocale();
  return locale as AppLocale;
};

export const getPathLocale = async () => {
  const locale = await getLocale();
  return appLocaleToPathLocale(locale);
};
