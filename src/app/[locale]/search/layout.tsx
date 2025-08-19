import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { getMetadata } from "@/lib/seo";
import { navigation } from "@/lib/urls";
import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return getMetadata({
    title: (await getTranslations("common"))("search"),
    pagePath: navigation.search(),
    locale,
  });
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar layout="home" />

      <main className="bg-background flex min-h-screen w-full flex-col pt-16 pb-24 sm:pt-24">
        {children}
      </main>

      <Footer />
    </>
  );
}
