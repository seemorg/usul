import { routing } from "@/i18n/config";

declare module "next-intl" {
  interface AppConfig {
    Messages: {
      common: typeof import("../../locales/en/common.json");
      entities: typeof import("../../locales/en/entities.json");
      home: typeof import("../../locales/en/home.json");
      reader: typeof import("../../locales/en/reader.json");
      meta: typeof import("../../locales/en/meta.json");
      about: typeof import("../../locales/en/about.json");
      team: typeof import("../../locales/en/team.json");
      donate: typeof import("../../locales/en/donate.json");
      collections: typeof import("../../locales/en/collections.json");
    };
    // Formats: typeof formats;
    Locale: (typeof routing.locales)[number];
  }
}
