import { Logo } from "@/components/Icons";
import Container from "@/components/ui/container";
import { db } from "@/server/db";
import Link from "next/link";
import { cache } from "react";

const cachedFindAllBooks = cache(() => db.query.book.findMany());

export default async function HomePage() {
  const books = await cachedFindAllBooks();

  return (
    <div className="flex min-h-screen w-full bg-primary py-28 text-white">
      <Container className="flex flex-col items-center">
        <h1 className="flex flex-col items-center gap-10 font-abhaya text-7xl font-bold md:flex-row">
          <Logo className="h-28 w-auto" />
          <div className="hidden h-16 w-1 rounded-full bg-white md:block" />
          <span className="-mb-2">Library</span>
        </h1>

        <div className="mt-20 grid grid-cols-2 gap-10">
          {books.map((book) => (
            <Link
              prefetch={false}
              key={book.id}
              href={`/${book.id.replaceAll(".", "-")}/reader`}
              className=""
            >
              <h2 className="text-xl font-semibold">
                {book.primaryArabicName}
              </h2>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
