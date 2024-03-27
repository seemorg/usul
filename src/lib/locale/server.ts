"use server";

import { getLocale as baseGetLocale } from "next-intl/server";
import type { AppLocale } from "~/i18n.config";

export const getLocale = async () => {
  const locale = await baseGetLocale();
  return locale as AppLocale;
};
