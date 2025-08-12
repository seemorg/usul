import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark:bg-background bg-[#F8F6F6]">
      <Navbar layout="home" />

      {children}

      <Footer />
    </div>
  );
}
