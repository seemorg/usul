import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted dark:bg-background">
      <Navbar />

      <main className="flex min-h-screen w-full flex-col py-24">
        {children}
      </main>

      <Footer />
    </div>
  );
}
