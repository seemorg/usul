import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />

      <main className="flex min-h-screen w-full flex-col bg-background pb-24 pt-24">
        {children}
      </main>

      <Footer />
    </div>
  );
}
