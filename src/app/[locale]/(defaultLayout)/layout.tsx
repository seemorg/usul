import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />

      <main className="bg-background flex min-h-screen w-full flex-col py-24">
        {children}
      </main>

      <Footer />
    </div>
  );
}
