import DonationBanner from "@/components/donation-banner";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { env } from "@/env";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {env.NEXT_PUBLIC_ENABLE_DONATION_BANNER === "true" && (
        <DonationBanner />
      )}
      <Navbar />

      <main className="bg-background flex min-h-screen w-full flex-col py-24">
        {children}
      </main>

      <Footer />
    </div>
  );
}
