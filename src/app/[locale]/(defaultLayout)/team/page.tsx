import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { HeartHandshakeIcon, MailIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import MemberCard from "./member-card";

export default async function TeamPage() {
  const t = await getTranslations("about");

  return (
    <Container className="max-w-5xl pt-16 2xl:max-w-6xl">
      <h1 className="mb-15 text-5xl font-bold">Meet the team</h1>
      <p className="mt-5">
        The Seemorg Foundation team is made up of engineers, researchers, and
        designers passionate about building state-of-the-art Islamic research.
        Our mission is to bridge the gap between classical knowledge and modern
        technology, ensuring that the rich heritage of Islamic literature is
        readily available to the whole world.
      </p>

      <div className="flex items-center gap-5">
        <Button className="mt-10 h-9 gap-2">
          <HeartHandshakeIcon className="size-4" />
          Become a volunteer
        </Button>
        <Button className="mt-10 h-9 gap-2" variant="outline">
          <MailIcon className="size-4" />
          Contact Us
        </Button>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <MemberCard
          name="Abdellatif Abdelfattah"
          role="CEO"
          description="Abdellatif is a serial enterprenuer. Before Usul, he lead engineering at Quran.com."
          image=""
        />
        <MemberCard
          name="Ahmed Riad"
          role="Founding Engineer"
          description="Abdellatif is a serial enterprenuer. Before Usul, he lead engineering at Quran.com."
          image=""
        />
        <MemberCard
          name="Gene Ryaz"
          role="Researcher"
          description="Abdellatif is a serial enterprenuer. Before Usul, he lead engineering at Quran.com."
          image=""
        />
        <MemberCard
          name="Ismail Safadi"
          role="Researcher"
          description="Abdellatif is a serial enterprenuer. Before Usul, he lead engineering at Quran.com."
          image=""
        />
        <MemberCard
          name="Ahmed Noor"
          role="Researcher"
          description="Abdellatif is a serial enterprenuer. Before Usul, he lead engineering at Quran.com."
          image=""
        />
        <MemberCard
          name="Ahmed Khan"
          role="Researcher"
          description="Abdellatif is a serial enterprenuer. Before Usul, he lead engineering at Quran.com."
          image=""
        />
        <MemberCard
          name="Ahmet Aktan"
          role="Digitization Lead"
          description="Abdellatif is a serial enterprenuer. Before Usul, he lead engineering at Quran.com."
          image=""
        />
      </div>

      <div className="mb-20 mt-24">
        <h1 className="text-5xl font-bold">Meet the board</h1>
        <p className="mt-5">
          The Seemorg Foundation board is made up of research and technology
          experts. They built experience over decades and are now bringing it to
          Usul.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <MemberCard
            name="Adnan Zulfiqar"
            description="Abdellatif is a serial enterprenuer. Before Usul, he lead engineering at Quran.com."
            image=""
          />
          <MemberCard
            name="Intisar Rabb"
            description="Abdellatif is a serial enterprenuer. Before Usul, he lead engineering at Quran.com."
            image=""
          />
          <MemberCard
            name="Zeki Mokhtarzada"
            description="Abdellatif is a serial enterprenuer. Before Usul, he lead engineering at Quran.com."
            image=""
          />
        </div>
      </div>
    </Container>
  );
}
