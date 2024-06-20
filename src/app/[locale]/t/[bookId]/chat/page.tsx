import Container from "@/components/ui/container";
import ChatWindow from "./chat";

const booksToIndex = [
  { slug: "muwatta" },
  // { slug: "fath-bari" },
  { slug: "sahih" }, // bukhari
  { slug: "sunan-3" }, // sunan ibn majah
  { slug: "ihya-culum-din" },
];

export default function ChatPage({
  params: { bookId },
}: {
  params: {
    bookId: string;
  };
}) {
  if (!booksToIndex.find((book) => book.slug === bookId)) {
    return (
      <div className="pt-16 sm:pt-24">
        <h1 className="mt-16 text-6xl font-bold sm:text-7xl">
          Book not supported
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="pt-16 sm:pt-32">
        <Container className="flex">
          <h1 className="text-4xl font-bold sm:text-5xl">Chat</h1>
        </Container>
      </div>

      <Container className="mt-10 bg-background sm:mt-20">
        <ChatWindow bookSlug={bookId} />
      </Container>
    </>
  );
}
