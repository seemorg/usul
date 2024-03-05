import { Logo } from "@/components/Icons";
import Container from "@/components/ui/container";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { findAllGenres } from "@/server/services/genres";

export default async function GenresPage() {
  const genres = await findAllGenres();

  return (
    <div className="flex min-h-screen w-full bg-primary py-28 text-white">
      <Container className="flex flex-col items-center">
        <h1 className="flex flex-col items-center gap-10 font-abhaya text-7xl font-bold md:flex-row">
          <Logo className="h-28 w-auto" />
          <div className="hidden h-16 w-1 rounded-full bg-white md:block" />
          <span className="-mb-2">Genres</span>
        </h1>

        <div className="mt-20 grid grid-cols-2 gap-10">
          {genres.map((genre) => (
            <Link
              prefetch={false}
              key={genre.id}
              href={navigation.genres.bySlug(genre.slug)}
            >
              <h2 className="text-xl font-semibold">{genre.name}</h2>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
