import { Button } from "@/components/ui/button";
import Navbar from "../_components/navbar";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div>
      <Navbar />

      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col justify-center gap-10">
          <h1 className="text-7xl font-black text-foreground">{t("lost")}</h1>

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
