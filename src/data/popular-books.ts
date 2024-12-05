import type { PathLocale } from "@/lib/locale/utils";
import { db } from "@/server/db";
import { getLocaleWhereClause } from "@/server/db/localization";

export const popularBooks = [
  { id: "0256Bukhari.Sahih" },
  { id: "0261Muslim.Sahih" },
  { id: "0275AbuDawudSijistani.Sunan" },
  { id: "0273IbnMaja.Sunan" },
  { id: "0303Nasai.SunanSughra" },
  { id: "1420MuhammadNasirDinAlbani.SahihWaDacifSunanTirmidhi" },
  { id: "0179MalikIbnAnas.Muwatta" },
  { id: "0676Nawawi.RiyadSalihin" },
  { id: "0505Ghazali.IhyaCulumDin" },
  { id: "0911Suyuti.TafsirJalalayn" },
  { id: "0774IbnKathir.TafsirQuran" },
  { id: "0852IbnHajarCasqalani.FathBari" },
];

export const popularIslamicLawBooks = [
  { id: "0179MalikIbnAnas.Muwatta" },
  { id: "0620IbnQudamaMaqdisi.Mughni" },
  { id: "0593BurhanDinFarghaniMarghinani.HidayaFiSharhBidaya" },
  { id: "0595IbnRushdHafid.BidayatMujtahid" },
  { id: "0204Shafici.Umm" },
  { id: "0428AbuHusaynQuduri.Mukhtasar" },
  { id: "0204Shafici.Risala" },
  { id: "0695IbnAbiJamra.MukhtasarSahihBukhari" },
  { id: "0483IbnAhmadSarakhsi.Mabsut" },
  { id: "1252IbnCabidinDimashqi.RaddMuhtar" },
  { id: "0456IbnHazm.MuhallaBiAthar" },
];

export const popularIslamicHistoryBooks = [
  { id: "0213IbnHisham.SiraNabawiyya" },
  { id: "0151IbnIshaq.Sira" },
  { id: "0751IbnQayyimJawziyya.ZadMacad" },
  { id: "0774IbnKathir.Bidaya" },
  { id: "0310Tabari.Tarikh" },
  { id: "0241IbnHanbal.FadailSahaba" },
  { id: "0354IbnHibbanBusti.Sira" },
  { id: "0303Nasai.Wafat" },
  { id: "0456IbnHazm.JawamicSira" },
  { id: "0774IbnKathir.QisasAnbiya" },
];

const fetchBooksByIds = async (ids: string[], locale: PathLocale) => {
  const localeWhere = getLocaleWhereClause(locale);

  const books = await db.book.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      primaryNameTranslations: localeWhere,
      author: {
        include: {
          primaryNameTranslations: localeWhere,
        },
      },
      genres: {
        include: {
          nameTranslations: localeWhere,
        },
      },
    },
  });

  // Order books by their index in the ids array to maintain specified order
  return books.sort((a, b) => {
    const aIndex = ids.indexOf(a.id);
    const bIndex = ids.indexOf(b.id);
    return aIndex - bIndex;
  });
};

export const fetchPopularBooks = async (locale: PathLocale) => {
  return fetchBooksByIds(
    popularBooks.map((s) => s.id),
    locale,
  );
};

export const fetchPopularIslamicLawBooks = async (locale: PathLocale) => {
  return fetchBooksByIds(
    popularIslamicLawBooks.map((b) => b.id),
    locale,
  );
};

export const fetchPopularIslamicHistoryBooks = async (locale: PathLocale) => {
  return fetchBooksByIds(
    popularIslamicHistoryBooks.map((b) => b.id),
    locale,
  );
};
