import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Usul",
    short_name: "Usul",
    description: "Usul - The Research Tool for Islamic Texts",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: SITE_CONFIG.themeColor,
    background_color: "#ffffff",
    display: "standalone",
  };
}
