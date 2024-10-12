import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { HeartHandshakeIcon, MailIcon } from "lucide-react";
import MemberCard from "./member-card";
import { boardMembers, members } from "./members";
import { getMetadata } from "@/lib/seo";

export const generateMetadata = async () =>
  getMetadata({
    title: "Team",
    description: "Meet the Usul team",
  });

export default async function TeamPage() {
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
        {members.map((member) => (
          <MemberCard
            key={member.name}
            name={member.name}
            role={member.role}
            description={member.description}
            image={member.image}
            blurDataUrl={member.blurDataUrl}
          />
        ))}
      </div>

      <div className="mb-20 mt-44">
        <h1 className="text-5xl font-bold">Meet the board</h1>
        <p className="mt-5">
          The Seemorg Foundation’s board is made up of distinguished research
          and technology experts, each with decades of experience in their
          respective fields. Together, they oversee the organization and are
          ensure that it advances towards its mission of advancing Islamic
          scholarship.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {boardMembers.map((member) => (
            <MemberCard
              key={member.name}
              name={member.name}
              description={member.description}
              image={member.image}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
