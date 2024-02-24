import { Abhaya_Libre, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";

const inter = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  // weight: ["400", "700"],
});

const abhaya = Abhaya_Libre({
  subsets: ["latin"],
  variable: "--font-abhaya",
  weight: ["400", "500", "600", "700", "800"],
});

const amiri = localFont({
  variable: "--font-amiri",
  src: [
    {
      path: "../fonts/amiri/Amiri-Regular.ttf",
      weight: "400",
    },
    {
      path: "../fonts/amiri/Amiri-Bold.ttf",
      weight: "700",
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

export const getFontsClassnames = () =>
  [inter.variable, abhaya.variable, amiri.variable].join(" ");
