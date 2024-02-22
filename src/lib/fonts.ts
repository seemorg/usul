import { Abhaya_Libre, Inter, Amiri } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const abhaya = Abhaya_Libre({
  subsets: ["latin"],
  variable: "--font-abhaya",
  weight: ["400", "500", "600", "700", "800"],
});

const amiri = Amiri({
  subsets: ["latin", "arabic"],
  variable: "--font-amiri",
  weight: ["400", "700"],
});

export const getFontsClassnames = () =>
  [inter.variable, abhaya.variable, amiri.variable].join(" ");
