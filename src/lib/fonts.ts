import { Plus_Jakarta_Sans, Amiri } from "next/font/google";
import localFont from "next/font/local";

const inter = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const amiri = Amiri({
  variable: "--font-amiri",
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
});

const rubik = localFont({
  variable: "--font-rubik",
  src: [
    {
      path: "../fonts/rubik/rubik-variable-font.ttf",
    },
  ],
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF",
    },
  ],
});

const uthmanicHafs = localFont({
  variable: "--font-uthmanic-hafs",
  src: [
    {
      path: "../fonts/uthmanic-hafs/uthmanic-hafs.ttf",
    },
  ],
});

export const getFontsClassnames = () =>
  [inter.variable, rubik.variable, amiri.variable, uthmanicHafs.variable].join(
    " ",
  );
