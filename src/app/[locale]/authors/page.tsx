import { Logo } from "@/components/Icons";
import Container from "@/components/ui/container";
import { navigation } from "@/lib/urls";
import { db } from "@/server/db";
import Link from "next/link";
import { cache } from "react";

const cachedFindAllAuthors = cache(() => db.query.author.findMany());

export default async function AuthorsPage() {
  const authors = await cachedFindAllAuthors();

  return (
    <div className="flex min-h-screen w-full bg-primary py-28 text-white">
      <Container className="flex flex-col items-center">
        <h1 className="flex flex-col items-center gap-10 font-abhaya text-7xl font-bold md:flex-row">
          <Logo className="h-28 w-auto" />
          <div className="hidden h-16 w-1 rounded-full bg-white md:block" />
          <span className="-mb-2">Authors</span>
        </h1>

        <div className="mt-20 grid grid-cols-2 gap-10">
          {authors.map((author) => (
            <Link
              prefetch={false}
              key={author.slug}
              href={navigation.authors.bySlug(author.slug)}
            >
              <h2 className="text-xl font-semibold">
                {author.primaryArabicName ?? author.primaryLatinName}
              </h2>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
