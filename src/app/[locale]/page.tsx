import { Logo } from "@/components/Icons";
import Container from "@/components/ui/container";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen w-full items-center bg-primary text-white">
      <Container className="flex flex-col items-center">
        <h1 className="flex flex-col items-center gap-10 font-abhaya text-7xl font-bold md:flex-row">
          <Logo className="h-28 w-auto" />
          <div className="hidden h-16 w-1 rounded-full bg-white md:block" />
          <span className="-mb-2">Library</span>
        </h1>
      </Container>
    </div>
  );
}
