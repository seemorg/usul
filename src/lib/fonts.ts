import { Plus_Jakarta_Sans, Scheherazade_New } from "next/font/google";
import localFont from "next/font/local";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const scheherazade = Scheherazade_New({
  variable: "--font-scheherazade",
  weight: ["400", "500", "700"],
  subsets: ["arabic", "latin"],
});

const rubik = localFont({
  variable: "--font-rubik",
  src: [
    // {
    //   path: "../fonts/rubik/rubik-variable-font.ttf",
    // },
    {
      path: "../fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-Bold.ttf",
      weight: "700",
    },
    {
      path: "../fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-Medium.ttf",
      weight: "500",
    },
    {
      path: "../fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-Regular.ttf",
      weight: "400",
    },
    {
      path: "../fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-Light.ttf",
      weight: "300",
    },
    {
      path: "../fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-ExtraLight.ttf",
      weight: "200",
    },
    {
      path: "../fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-Thin.ttf",
      weight: "100",
    },
  ],
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF",
    },
    {
      prop: "size-adjust",
      value: "110%",
    },
  ],
});

// TODO: 290kb HUGE FONT, bring back later if needed
// const uthmanicHafs = localFont({
//   variable: "--font-uthmanic-hafs",
//   src: [
//     {
//       path: "../fonts/uthmanic-hafs/uthmanic-hafs.ttf",
//     },
//   ],
// });

export const getFontsClassnames = () =>
  [
    plusJakartaSans.variable,
    rubik.variable,
    scheherazade.variable,
    // uthmanicHafs.variable,
  ].join(" ");
