// import ReaderSidebar, { tabs } from "./_components/sidebar";
// import SidebarResizer from "./_components/sidebar/sidebar-resizer";
import ReaderContextProviders from "./_components/context";
// import { MobileSidebarProvider } from "./_components/mobile-sidebar-provider";

export default function ReaderLayout({
  children,
  // params: { bookId },
}: {
  children: React.ReactNode;
  // params: {
  //   bookId: string;
  // };
}) {
  return <ReaderContextProviders>{children}</ReaderContextProviders>;
}
