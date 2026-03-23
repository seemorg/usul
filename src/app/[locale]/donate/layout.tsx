import DonationBanner from "@/components/donation-banner";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { env } from "@/env";

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark:bg-background bg-[#F8F6F6]">
      {env.NEXT_PUBLIC_ENABLE_DONATION_BANNER === "true" && (
        <DonationBanner />
      )}
      <Navbar />

      {children}

      <Footer />
    </div>
  );
}
