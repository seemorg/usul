import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";

export default function RootEntityPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />

      <main className="bg-background flex min-h-screen w-full flex-col pb-24">
        {children}
      </main>

      <Footer />
    </div>
  );
}
