import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { HeartHandshakeIcon, MailIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import MemberCard from "./member-card";

const members = [
  {
    name: "Abdellatif Abdelfattah",
    role: "CEO",
    description:
      "Abdellatif co-founded Tarteel AI, lead engineering at Quran.com, and worked at Twitter.",
    image: "",
  },
  {
    name: "Ahmed Riad",
    role: "Founding Engineer",
    description:
      "Ahmed co-founded Remail AI, Betterbook, and was an engineer at Quran.com.",
    image: "",
  },
  {
    name: "Ryad Ramo",
    role: "Researcher",
    description:
      "Ryad specializes in Maliki fiqh and Andulisian hisory. He co-managed Markaz Imam Malik.",
    image: "",
  },
  {
    name: "Ismail Safadi",
    role: "Researcher",
    description:
      "Ismail specializes in Hanafi fiqh. He studied at the University of Jordan and in Turkey.",
    image: "",
  },
  {
    name: "Ahmed Noor",
    role: "Researcher",
    description:
      "Ahmed is an Islamic theology student at İZÜ. He’s fluent in Arabic, English, and in Urdu.",
    image: "",
  },
  {
    name: "Ahmed Khan",
    role: "Researcher",
    description:
      "Ahmed is a student at Zaytuna College. He’s the creator of The Creative Minority podcast.",
    image: "",
  },
  {
    name: "Ahmet Aktan",
    role: "Digitization Lead",
    description:
      "Ahmed holds a PhD. from Al-Azhar university. He leads the digitization team and efforts.",
    image: "",
  },
];

const boardMembers = [
  {
    name: "Adnan Zulfiqar",
    description:
      "Adnan specializes in Islamic and criminal law. He drafted criminal codes for Maldives and Somalia.",
    image: "",
  },
  {
    name: "Intisar Rabb",
    description:
      "Intisar is a Law professor at Harvard. She leads SHARIAsource and the Program in Islamic Law.",
    image: "",
  },
  {
    name: "Zeki Mokhtarzada",
    description:
      "Zeki is an enterprenuer with with deep technical expertise. He co-founded Freewebs and Truebill.",
    image: "",
  },
];

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
        {members.map((member) => (
          <MemberCard
            key={member.name}
            name={member.name}
            role={member.role}
            description={member.description}
            image={member.image}
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
