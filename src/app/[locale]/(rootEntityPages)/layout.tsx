import Navbar from "@/app/_components/navbar";

export default function RootEntityPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar sidebarContent={null} />

      <main className="flex min-h-screen w-full flex-col bg-background pb-24">
        {children}
      </main>
    </div>
  );
}
