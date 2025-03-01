const idToName: Record<string, string> = {
  Shamela: "al-Maktaba al-Shāmila",
  Sham19Y: "al-Maktaba al-Shāmila (2019 additions)",
  JK: "al-Jāmiʿ al-kabīr",
  Shia: "al-Maktaba al-Shīʿiyya",
  ShamAY: "Special Shamela",
  Zaydiyya: "al-Maktaba al-Shāmila al-Zaydiyya",
  ShamIbadiyya: "al-Maktaba al-Shāmila al-Ibāḍiyya",
  GRAR: "Graeco-Arabic Studies Corpus",
  Tafsir: "al-Tafāsīr",
  Sham30K: "al-Maktaba al-Shāmila (30.000 texts)",
  Filaha: "The Filāḥa Project",
  Hindawi: "Hindawi",
  BibleCorpus: "Bible Corpus",
};

export const versionToName = (version: PrismaJson.BookVersion) => {
  if (version.source === "turath") {
    return "Shamela (Turath.io)";
  }

  if (version.source === "external") {
    return "External";
  }

  if (version.source === "pdf") {
    return "Usul";
  }

  // openiti version handling
  const parts = version.value.split(".");
  const name = parts[parts.length - 1]?.split("-")[0]?.replace("Vols", "");

  // remove numbers at the end
  if (name) {
    const id = name.replace(/\d+$/, "");
    return idToName[id] ?? id;
  }

  return name;
};
