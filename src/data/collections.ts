import type { CollectionCardProps } from "@/components/ui/collection-card";
import type { NamespaceTranslations } from "@/types/NamespaceTranslations";

export const collections: {
  title: NamespaceTranslations<"collections">;
  description: NamespaceTranslations<"collections">;
  color: CollectionCardProps["color"];
  pattern: CollectionCardProps["pattern"];
  slug: string;
  bookIds: string[];
}[] = [
  {
    title: "legal-canons.title",
    description: "legal-canons.description",
    color: "red",
    pattern: 2,
    slug: "legal-canons",
    bookIds: [
      "xgaoldpjwdfxqx4yougfpr6o",
      "0970IbnIbrahimIbnNujaymMisri.AshbahWaNazair",
      "hfnoebkz8momypmjlmp7kfzw",
      "0684ShihabDinQarafi.Furuq",
      "0759AbuCabdAllahMaqqari.Qawacid",
      "0914IbnYahyaWansharisi.IdahMasalik",
      "0914IbnYahyaWansharisi.CuddatBuruq",
      "0660SultanCulamaCizzDinDimashqi.QawacidAhkam",
      "0771TajDinSubki.AshbahWaNazair",
      "0911Suyuti.Ashbah",
      "0728IbnTaymiyya.QawacidNuraniyya",
      "0795IbnRajabHanbali.Qawacid",
      "0909IbnMabrid.QawacidKulliyya",
      "0826MiqdadSuyuri.NadadQawacid",
      "ex5tj56kx86biezvnngr5fcz",
      "lj9eru8v4zhvy358830ssdcu",
      "litim0rkawdx22knvgezbucq",
      "1450MahmudHarmush.MucjamQawacidFiqhiyya",
      "u7k4xd1xfq9hfkv60ziuw06i",
      "n8puo532hxymiqunknjsjhui",
      "cwxmfhmbcp69f40j1c1w0wqj",
      "qkad0wubc9flndxzomkizldq",
      "ijzv5ghfcjw9ehphqmy5m6ob",
      "e1bpvpqllzan9kggty0koc08",
      "jvgml8dyh70wnqgdfmfpttem",
      "igzffeocfm2f31suozec9vbx",
      "j975mv5ng7d6yupj92oalqk2",
      "qs7trgbye1sjj1nf04nuw696",
      "cdmterqdow2zv232qdbpxhly",
      "zrop56zg6wrub85ylzpibnms",
      "w87u7gk93qnnwkfoab9hxt4q",
    ],
  },
];
