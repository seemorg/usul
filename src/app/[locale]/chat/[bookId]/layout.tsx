import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import { Button } from "@/components/ui/button";

export default function ChatPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />

      {children}

      {/* <Footer /> */}
    </div>
  );
}
