import { useBookDetails } from "../../_contexts/book-details.context";
import { useTranslations } from "next-intl";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Link } from "@/navigation";
import { navigation } from "@/lib/urls";
import { Badge } from "@/components/ui/badge";
import { useDirection } from "@/lib/locale/utils";
import PublicationDetails from "../publication-details";

const AuthorHoverCard = ({ children }: { children: React.ReactNode }) => {
  const { bookResponse } = useBookDetails();
  const book = bookResponse.book;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span>{children}</span>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-full max-w-[400px] text-muted-foreground"
        avoidCollisions
        side="left"
      >
        <p className="line-clamp-4 text-ellipsis text-sm">{book.author.bio}</p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default function BookInfo({ className }: { className?: string }) {
  const { bookResponse } = useBookDetails();
  const t = useTranslations();
  const dir = useDirection();

  const book = bookResponse.book;
  const genres = book.genres;
  const primaryName = book.primaryName;
  const secondaryName = book.secondaryName;
  const author = book.author;
  const year = author.year;
  const authorPrimaryName = author.primaryName;
  const authorSecondaryName = author.secondaryName;

  return (
    <div className={className} dir={dir}>
      <div className="flex justify-between">
        <bdi className="flex-1">
          <h1 className="text-4xl font-bold">{primaryName}</h1>
        </bdi>

        {secondaryName && (
          <bdi className="flex-1">
            <h1 className="text-4xl font-bold">{secondaryName}</h1>
          </bdi>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <AuthorHoverCard>
            <Link
              href={navigation.authors.bySlug(book.author.slug)}
              className="text-base text-primary underline underline-offset-4"
              prefetch
            >
              {authorPrimaryName} - {t("common.year-format.ah.value", { year })}
            </Link>
          </AuthorHoverCard>
        </div>

        {authorSecondaryName && (
          <bdi>
            <AuthorHoverCard>
              <Link
                href={navigation.authors.bySlug(book.author.slug)}
                className="text-base text-primary underline underline-offset-4"
                prefetch
              >
                {authorSecondaryName} -{" "}
                {t("common.year-format.ah.value", { year })}
              </Link>
            </AuthorHoverCard>
          </bdi>
        )}
      </div>

      <PublicationDetails
        className="mt-6"
        publicationDetails={bookResponse.content.publicationDetails}
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground">{t("entities.genres")}</p>

        {genres.map((genre) => (
          <Link key={genre.id} href={navigation.genres.bySlug(genre.slug)}>
            <Badge variant="outline" className="text-sm hover:bg-accent">
              {genre.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
