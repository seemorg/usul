import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

import Navbar from "../../components/navbar";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div>
      <Navbar />

      <div className="bg-background flex h-screen w-full items-center justify-center">
        <div className="flex flex-col justify-center gap-10">
          <h1 className="text-foreground text-7xl font-black">{t("lost")}</h1>

          <div className="mx-auto w-auto grow-0">
            <Button asChild size="lg">
              <Link href="/">{t("go-back-home")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
