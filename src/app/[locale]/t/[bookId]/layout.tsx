import Providers from "./providers";
import { cn } from "@/lib/utils";
import { Scheherazade_New } from "next/font/google";

const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  style: "normal",
  variable: "--font-scheherazade",
  weight: ["400", "700"],
});

function ReaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div
        className={cn(
          "max-h-screen overflow-hidden bg-reader",
          scheherazade.variable,
        )}
      >
        {children}
      </div>
    </Providers>
  );
}

export default ReaderLayout;
