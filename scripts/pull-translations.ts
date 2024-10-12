import _otaClient from "@crowdin/ota-client";
import fs from "fs";

const OtaClient = (_otaClient as any).default as typeof _otaClient;

const hash = process.argv
  .find((arg) => arg.startsWith("--hash="))
  ?.split("=")[1];

if (!hash) {
  console.error(
    "❌ No hash provided. Please provide a hash using --hash=<hash>",
  );
  process.exit(1);
}

const client = new OtaClient(hash, { disableJsonDeepMerge: true });

const translations = await client.getTranslations();

for (const longLocale in translations) {
  const files = translations[longLocale] ?? [];
  const shortLocale = longLocale.split("-")[0];

  for (const file of files) {
    const fileName = file.file.split("/").pop();
    const content = file.content;

    const path = `locales/${shortLocale}/${fileName}`;

    fs.writeFileSync(path, JSON.stringify(content, null, 2));
  }
}

console.log("✅ Successfully pulled translations");
