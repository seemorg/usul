import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import Container from "@/components/ui/container";

export default function EntityPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />

      <main className="flex min-h-screen w-full bg-background pb-24 pt-24 sm:pt-36">
        <Container>{children}</Container>
      </main>

      <Footer />
    </div>
  );
}
