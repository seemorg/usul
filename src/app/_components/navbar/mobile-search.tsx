import { Button } from "@/components/ui/button";
import MobileMenu from "./mobile-menu";
import { useNavbarStore } from "@/stores/navbar";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import SearchBar from "./search-bar";

export default function MobileSearch() {
  const showSearch = useNavbarStore((s) => s.showSearch);
  const setShowSearch = useNavbarStore((s) => s.setShowSearch);
  const t = useTranslations("common");

  if (!showSearch) return null;

  return (
    <MobileMenu className="z-42 pt-10">
      <div className="absolute top-4 flex items-center gap-2 ltr:left-2 rtl:right-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setShowSearch(false)}
        >
          <ArrowLeftIcon className="block h-5 w-5 rtl:rotate-180" />
        </Button>

        <h1 className="text-lg font-semibold">{t("search")}</h1>
      </div>

      <div className="mt-8">
        <SearchBar autoFocus isMenu />
      </div>
    </MobileMenu>
  );
}
