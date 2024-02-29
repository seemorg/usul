import Navbar from "@/app/_components/navbar";
import Container from "@/components/ui/container";

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar sidebarContent={null} />

      <main className="flex min-h-screen w-full bg-background pb-24 pt-36">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
