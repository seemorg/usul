import { Logo } from "@/components/Icons";
import Container from "@/components/ui/container";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen w-full items-center bg-primary text-white">
      <Container className="flex flex-col items-center">
        <h1 className="font-abhaya flex items-center gap-10 text-7xl font-bold">
          <Logo className="h-28 w-auto" />
          <div className="h-16 w-1 rounded-full bg-white" />
          <span className="-mb-2">Library</span>
        </h1>
      </Container>
    </div>
  );
}
