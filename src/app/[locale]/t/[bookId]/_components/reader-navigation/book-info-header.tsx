/* eslint-disable react/jsx-key */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { useDirection } from "@/lib/locale/utils";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import { useBookDetailsStore } from "../../_stores/book-details";
import Container from "@/components/ui/container";
import { useBookDetails } from "../../_contexts/book-details.context";

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

const PublicationDetails = () => {
  const { bookResponse } = useBookDetails();
  const publicationDetails = bookResponse.content.publicationDetails;
  const t = useTranslations();

  if (!publicationDetails) return null;

  const final: { title: string; text: string | React.ReactNode }[] = [];

  if (publicationDetails.investigator)
    final.push({
      title: t("reader.publication-details.editor"),
      text: publicationDetails.investigator,
    });

  if (publicationDetails.publisher)
    final.push({
      title: t("reader.publication-details.publisher"),
      text: publicationDetails.publisher,
    });

  if (publicationDetails.editionNumber)
    final.push({
      title: t("reader.publication-details.print-version"),
      text: publicationDetails.editionNumber,
    });

  return (
    <div className="relative mt-5 flex flex-wrap items-center gap-5 text-sm">
      {final.map((item, index, arr) => (
        <Fragment key={index}>
          <div>
            <p>{item.title}</p>
            <bdi className="mt-1 block font-semibold">{item.text}</bdi>
          </div>

          {index < arr.length - 1 && (
            <Separator orientation="vertical" className="h-12" />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default function BookInfoHeader() {
  const { bookResponse } = useBookDetails();
  const dir = useDirection();
  const t = useTranslations();
  const { isOpen, setIsOpen } = useBookDetailsStore();

  const book = bookResponse.book;
  const {
    primaryName,
    secondaryName,
    author: {
      primaryName: authorPrimaryName,
      secondaryName: authorSecondaryName,
      year,
    },
    genres,
  } = book;

  return (
    <div className="relative w-full bg-reader px-5 lg:px-8">
      <Container className="flex items-center justify-between border-b border-border px-0 py-5 2xl:max-w-5xl">
        <AccordionPrimitive.Root
          type="single"
          collapsible
          dir={dir}
          asChild
          // TODO: fix this
          defaultValue={isOpen ? "header" : undefined}
          // value={isOpen ? "header" : ""}
          onValueChange={(value) => setIsOpen(!!value && value === "header")}
        >
          <AccordionPrimitive.Item value="header" className="w-full">
            <AccordionPrimitive.Header asChild>
              {/*  className="[&[data-state=open]>div]:pointer-events-none [&[data-state=open]>div]:-translate-y-full [&[data-state=open]>div]:opacity-0" */}
              <div>
                <AccordionPrimitive.Trigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 left-1/2 z-10 size-8 -translate-x-1/2 translate-y-2/3 hover:bg-accent [&[data-state=open]>svg]:rotate-180"
                  >
                    <ChevronDownIcon className="size-4 transition-transform" />
                  </Button>
                </AccordionPrimitive.Trigger>

                <div className="flex justify-between transition-all">
                  <div
                    className={cn(
                      "flex items-center gap-3 text-base font-semibold",
                      book.secondaryName && "md:flex-1",
                    )}
                  >
                    {[
                      <p className="line-clamp-1">{book.primaryName}</p>,
                      <bdi className="line-clamp-1">
                        <Link
                          href={navigation.authors.bySlug(book.author.slug)}
                          className="text-primary underline underline-offset-4"
                        >
                          {book.author.primaryName}
                          {book.author.year ? ` d. ${book.author.year}` : ""}
                        </Link>
                      </bdi>,
                    ].map((item, index, arr) => (
                      <Fragment key={index}>
                        {item}
                        {index < arr.length - 1 && (
                          <Separator orientation="vertical" className="h-6" />
                        )}
                      </Fragment>
                    ))}
                  </div>

                  {book.secondaryName && (
                    <div className="hidden items-center justify-end gap-3 text-base font-semibold md:flex md:flex-1">
                      {[
                        <bdi className="line-clamp-1">
                          <Link
                            href={navigation.authors.bySlug(book.author.slug)}
                            className="text-primary underline underline-offset-4"
                          >
                            {book.author.secondaryName}
                            {book.author.year ? ` d. ${book.author.year}` : ""}
                          </Link>
                        </bdi>,
                        <p className="line-clamp-1">{book.secondaryName}</p>,
                      ].map((item, index, arr) => (
                        <Fragment key={index}>
                          {item}
                          {index < arr.length - 1 && (
                            <Separator orientation="vertical" className="h-6" />
                          )}
                        </Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </AccordionPrimitive.Header>

            <AccordionPrimitive.Content className="mt-5 overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="flex justify-between">
                <bdi className="flex-1">
                  <h2 className="text-3xl font-bold">{primaryName}</h2>
                </bdi>

                {secondaryName && (
                  <bdi className="flex-1">
                    <h2 className="text-3xl font-bold">{secondaryName}</h2>
                  </bdi>
                )}
              </div>

              <div className="mt-4 flex justify-between">
                <div>
                  <AuthorHoverCard>
                    <Link
                      href={navigation.authors.bySlug(book.author.slug)}
                      className="text-primary underline underline-offset-4"
                    >
                      {authorPrimaryName} -{" "}
                      {t("common.year-format.ah.value", { year })}
                    </Link>
                  </AuthorHoverCard>
                </div>

                {authorSecondaryName && (
                  <bdi>
                    <AuthorHoverCard>
                      <Link
                        href={navigation.authors.bySlug(book.author.slug)}
                        className="text-primary underline underline-offset-4"
                      >
                        {authorSecondaryName} -{" "}
                        {t("common.year-format.ah.value", { year })}
                      </Link>
                    </AuthorHoverCard>
                  </bdi>
                )}
              </div>

              <PublicationDetails />

              <div className="mt-10 flex justify-between">
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={navigation.genres.bySlug(genre.slug)}
                    >
                      <Badge
                        variant="outline"
                        className="text-sm hover:bg-accent"
                      >
                        {genre.name}
                      </Badge>
                    </Link>
                  ))}
                </div>

                {/* <ToggleButton /> */}
              </div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        </AccordionPrimitive.Root>
      </Container>
    </div>
  );
}
