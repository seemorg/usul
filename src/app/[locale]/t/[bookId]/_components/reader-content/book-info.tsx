import { Badge } from "@/components/ui/badge";
import DottedList from "@/components/ui/dotted-list";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useDirection } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

import { useBookDetails } from "../../_contexts/book-details.context";
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
        className="text-muted-foreground w-full max-w-[400px]"
        avoidCollisions
        side="left"
      >
        <p className="line-clamp-4 text-sm text-ellipsis">{book.author.bio}</p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default function BookInfo({ className }: { className?: string }) {
  const { bookResponse } = useBookDetails();
  const t = useTranslations();
  const dir = useDirection();

  const book = bookResponse.book;
  const advancedGenres = book.advancedGenres;
  const regions = book.regions;
  const empires = book.empires;
  const primaryName = book.primaryName;
  const secondaryName = book.secondaryName;
  const author = book.author;
  const year = author.year;
  const authorPrimaryName = author.primaryName;
  const authorSecondaryName = author.secondaryName;

  const formattedYear = year
    ? `- ${t("common.year-format.ah.value", { year })}`
    : "";

  return (
    <div className={className} dir={dir}>
      <div className="flex justify-between">
        <bdi className="flex-1">
          <h1 className="text-2xl font-bold md:text-4xl">{primaryName}</h1>
        </bdi>

        {secondaryName && (
          <bdi className="flex-1">
            <h1 className="text-2xl font-bold md:text-4xl">{secondaryName}</h1>
          </bdi>
        )}
      </div>

      <div className="mt-2 flex justify-between md:mt-4">
        <div>
          <AuthorHoverCard>
            <Link
              href={navigation.authors.bySlug(book.author.slug)}
              className="link text-sm md:text-base"
              prefetch
            >
              {authorPrimaryName} {formattedYear}
            </Link>
          </AuthorHoverCard>
        </div>

        {authorSecondaryName && (
          <bdi>
            <AuthorHoverCard>
              <Link
                href={navigation.authors.bySlug(book.author.slug)}
                className="link text-sm md:text-base"
                prefetch
              >
                {authorSecondaryName} {formattedYear}
              </Link>
            </AuthorHoverCard>
          </bdi>
        )}
      </div>

      <PublicationDetails
        className="mt-6"
        publicationDetails={bookResponse.content.publicationDetails}
      />

      <DottedList
        className="mt-6 text-xs md:text-sm"
        items={[
          advancedGenres.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground">
                {t("entities.genres")}
              </span>
              {advancedGenres.map((advancedGenre) => (
                <Link
                  key={advancedGenre.id}
                  href={navigation.genres.bySlug(advancedGenre.slug)}
                >
                  <Badge variant="outline" className="hover:bg-accent">
                    {advancedGenre.name}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : null,
          regions.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground">
                {t("entities.regions")}
              </span>
              {regions.map((region) => (
                <Link
                  key={region.id}
                  href={navigation.regions.bySlug(region.slug)}
                >
                  <Badge variant="outline" className="hover:bg-accent">
                    {region.name}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : null,
          empires.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground">
                {t("entities.empires")}
              </span>
              {empires.map((empire) => (
                <Link
                  key={empire.id}
                  href={navigation.empires.bySlug(empire.slug)}
                >
                  <Badge variant="outline" className="hover:bg-accent">
                    {empire.name}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : null,
        ]}
      />
    </div>
  );
}
